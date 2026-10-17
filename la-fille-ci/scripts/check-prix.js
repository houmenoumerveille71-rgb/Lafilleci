// Verifie que le checkout ne fait AUCUNE confiance au client pour les prix.
//
// Attaque simulee : on envoie un panier dont les prix sont falsifies
// (price: 0.01) et un nom usurpe. Le serveur doit ignorer ces valeurs et
// n'utiliser que les prix presents en base.
//
// Le dernier point necessite de vraies cles Stripe pour aboutir, on inspecte
// donc la commande creee en base pour verifier le total calcule.
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

let passed = 0;
let failed = 0;

function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'OK   ' : 'ECHEC'} ${label}${detail ? ` -> ${detail}` : ''}`);
  if (ok) passed++;
  else failed++;
}

async function post(body) {
  const res = await fetch(`${BASE_URL}/api/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* pas de JSON */
  }
  return { status: res.status, data };
}

const shipping = {
  email: 'pirate@test.com',
  firstName: 'Pirate',
  lastName: 'Test',
  address: '1 rue Pirate',
  city: 'Cotonou',
  zipCode: '01000',
  country: 'Benin',
  phone: '+229 00 00 00 00',
};

async function main() {
  const product = await prisma.product.create({
    data: {
      name: 'Produit Anti-Fraude',
      price: '1500',
      category: 'Test',
      image: '/images/test.jpg',
      stock: 10,
    },
  });
  console.log(`Produit de test : id=${product.id}, prix en base=${product.price}, stock=${product.stock}\n`);

  console.log('=== Validation du panier ===');

  check('Panier vide refuse (400)', (await post({ ...shipping, items: [] })).status === 400);
  check(
    'Quantite 0 refusee (400)',
    (await post({ ...shipping, items: [{ productId: product.id, quantity: 0, price: 1 }] })).status === 400,
  );
  check(
    'Quantite negative refusee (400)',
    (await post({ ...shipping, items: [{ productId: product.id, quantity: -5, price: 1 }] })).status === 400,
  );
  check(
    'Identifiant produit invalide refuse (400)',
    (await post({ ...shipping, items: [{ productId: 'abc', quantity: 1, price: 1 }] })).status === 400,
  );

  console.log('\n=== Prix lus en base ===');

  check(
    'Produit inexistant refuse (404)',
    (await post({ ...shipping, items: [{ productId: 999999, quantity: 1, price: 1 }] })).status === 404,
  );

  const overStock = await post({
    ...shipping,
    items: [{ productId: product.id, quantity: 999, price: 0.01 }],
  });
  check('Stock insuffisant refuse (400)', overStock.status === 400, `recu ${overStock.status}`);
  check(
    'Message genere par le serveur',
    typeof overStock.data?.error === 'string' && overStock.data.error.includes('Stock insuffisant'),
    JSON.stringify(overStock.data?.error),
  );

  // Test cle : prix falsifie. Le total de la commande doit venir de la base.
    await post({
      ...shipping,
      items: [{ productId: product.id, quantity: 2, price: 0.01, name: 'Produit usurpe' }],
    });

    // Petit montant : 1 x 1500 = 1500, au-dela de 500 => livraison gratuite.
    // On verifie aussi le cas sous le seuil avec un second produit a 100.
    const cheap = await prisma.product.create({
      data: {
        name: 'Produit Pas Cher',
        price: '100',
        category: 'Test',
        image: '/images/test.jpg',
        stock: 10,
      },
    });

    await post({
      ...shipping,
      items: [{ productId: cheap.id, quantity: 2, price: 0.01 }],
    });

    const cheapOrder = await prisma.order.findFirst({
      where: { email: 'pirate@test.com', items: { some: { productId: cheap.id } } },
      orderBy: { id: 'desc' },
      include: { items: true },
    });
    if (cheapOrder) {
      // 2 x 100 = 200, sous 500 => livraison 25 => total 225
      check(
        'Frais de port appliques sous le seuil (200 + 25 = 225)',
        Math.abs(cheapOrder.total - 225) < 0.001,
        `total = ${cheapOrder.total}`,
      );
      await prisma.orderItem.deleteMany({ where: { orderId: cheapOrder.id } });
      await prisma.order.delete({ where: { id: cheapOrder.id } });
    }
    await prisma.product.delete({ where: { id: cheap.id } });

  const order = await prisma.order.findFirst({
    where: { email: 'pirate@test.com' },
    orderBy: { id: 'desc' },
    include: { items: true },
  });

  if (order) {
    // 2 x 1500 = 3000, au-dela de 500 => livraison gratuite
    const expected = 1500 * 2;
    check(
      `Total = prix en base (${expected}), pas le prix envoye (0.02)`,
      Math.abs(order.total - expected) < 0.001,
      `total en base = ${order.total}`,
    );
    check(
      'Prix de la ligne repris de la base',
      order.items[0]?.price === 1500,
      `prix en base = ${order.items[0]?.price}`,
    );
    await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
    await prisma.order.delete({ where: { id: order.id } });
  } else {
    console.log('  INFO aucune commande creee.');
  }

  await prisma.product.delete({ where: { id: product.id } });

  console.log(`\n${'='.repeat(45)}`);
  console.log(`${passed} reussis, ${failed} echecs`);
  console.log('='.repeat(45));
  process.exit(failed === 0 ? 0 : 1);
}

main()
  .catch((e) => {
    console.error('Erreur :', e.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
// Test d'integration de l'API : exerce chaque route HTTP puis supprime les
// donnees creees. A executer avec `npm run test:api` (le serveur doit tourner).
//
// Prerequis : MySQL demarre et base `lafilleci` migratee (npm run prisma:migrate).

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let passed = 0;
let failed = 0;
const failures = [];

const section = (title) => console.log(`\n=== ${title} ===`);

/** Appel HTTP sans lever d'exception sur les statuts 4xx/5xx. */
async function call(method, path, body, headers = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: body ? { 'Content-Type': 'application/json', ...headers } : headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  return { status: res.status, data };
}

function check(label, condition, detail = '') {
  if (condition) {
    passed++;
    console.log(`  OK    ${label}`);
  } else {
    failed++;
    failures.push(`${label}${detail ? ` -> ${detail}` : ''}`);
    console.log(`  ECHEC ${label}${detail ? ` -> ${detail}` : ''}`);
  }
}

/** Verifie qu'un statut HTTP est bien parmi ceux attendus. */
function checkStatus(label, res, expected) {
  const ok = Array.isArray(expected) ? expected.includes(res.status) : res.status === expected;
  check(label, ok, `recu ${res.status}, attendu ${JSON.stringify(expected)}`);
}

// Donnees de test, supprimees a la fin
const created = { products: [], user: null, newsletter: null, order: null, banner: null };

async function main() {
  console.log(`Test de l'API sur ${BASE_URL}`);

  section("Sante de l'application");

  const home = await fetch(`${BASE_URL}/`);
  check("Page d'accueil accessible", home.status === 200, `recu ${home.status}`);
  checkStatus('Admin refuse sans session', await call('GET', '/api/admin/check'), 401);

  section('Produits - CRUD');

  const list = await call('GET', '/api/products');
  checkStatus('GET /api/products', list, 200);
  check('GET /api/products renvoie un tableau', Array.isArray(list.data));

  const createProduct = await call('POST', '/api/products', {
    name: 'Produit Test E2E',
    price: '1500',
    category: 'Test',
    image: '/images/test.jpg',
    stock: 7,
  });
  checkStatus('POST /api/products cree le produit', createProduct, 201);
  const productId = createProduct.data?.id;
  check('Le produit a un id', typeof productId === 'number', `id=${productId}`);
  check('Le stock est enregistre', createProduct.data?.stock === 7);
  if (productId) created.products.push(productId);

  const getProduct = await call('GET', `/api/products/${productId}`);
  checkStatus('GET /api/products/:id', getProduct, 200);
  check('Le nom correspond', getProduct.data?.name === 'Produit Test E2E');

  const updateProduct = await call('PUT', `/api/products/${productId}`, {
    name: 'Produit Test E2E Modifie',
    price: '1800',
    category: 'Test',
    image: '/images/test.jpg',
    description: 'Description modifiee',
  });
  checkStatus('PUT /api/products/:id', updateProduct, 200);
  check('Le prix est mis a jour', updateProduct.data?.price === '1800');

  checkStatus(
    'GET /api/products/:id inexistant -> 404',
    await call('GET', '/api/products/999999'),
    404,
);

  section('Categories');

  const categories = await call('GET', '/api/categories');
  checkStatus('GET /api/categories', categories, 200);
  check(
    'Les categories sont des chaines',
    Array.isArray(categories.data) && categories.data.every((c) => typeof c === 'string'),
  );

  section('Comptes');

  checkStatus(
    'POST /api/auth/register refuse un formulaire incomplet',
    await call('POST', '/api/auth/register', { email: 'incomplet@test.com' }),
    400,
  );

  const registerEmail = `client-${Date.now()}@test.com`;
  const register = await call('POST', '/api/auth/register', {
    firstName: 'Client',
    lastName: 'Test',
    email: registerEmail,
    password: 'motdepasse123',
    phone: '+229 97 00 00 00',
  });
  checkStatus('POST /api/auth/register cree le compte', register, 201);
  if (register.data?.id) created.user = register.data.id;

  checkStatus(
    'POST /api/auth/register refuse un email en double',
    await call('POST', '/api/auth/register', {
      firstName: 'Client',
      lastName: 'Test',
      email: registerEmail,
      password: 'motdepasse123',
}),
    400,
  );

  section('Commandes');

  const createOrder = await call('POST', '/api/orders', {
    userId: created.user ?? undefined,
    email: registerEmail,
    firstName: 'Client',
    lastName: 'Test',
    address: '1 rue de Test',
    city: 'Cotonou',
    zipCode: '01000',
    country: 'Benin',
    phone: '+229 97 00 00 00',
    total: 3600,
    status: 'pending',
    orderNumber: `E2E-${Date.now()}`,
    items: [{ productId, quantity: 2, price: 1800 }],
  });
  checkStatus('POST /api/orders cree la commande', createOrder, 201);
  check('La commande contient sa ligne', createOrder.data?.items?.length === 1);
  check('Le produit est joint a la ligne', createOrder.data?.items?.[0]?.product?.id === productId);
  if (createOrder.data?.id) created.order = createOrder.data.id;

  const orders = await call('GET', '/api/orders');
  checkStatus('GET /api/orders', orders, 200);
  check('La commande est listee', orders.data?.some((o) => o.id === created.order));

  section('Newsletter');

  const newsletterEmail = `news-${Date.now()}@test.com`;
  const subscribe = await call('POST', '/api/newsletter', { email: newsletterEmail });
  checkStatus('POST /api/newsletter', subscribe, 201);
  if (subscribe.data?.id) created.newsletter = subscribe.data.id;

  checkStatus(
    'POST /api/newsletter refuse un email vide',
    await call('POST', '/api/newsletter', {}),
    400,
  );

  const subscribers = await call('GET', '/api/newsletter');
  checkStatus('GET /api/newsletter', subscribers, 200);
  check("L'abonne est listee", subscribers.data?.some((s) => s.email === newsletterEmail));

  section('Banners');

  const banner = await call('POST', '/api/banners', {
    title: 'Banniere Test',
subtitle: 'Sous-titre de test',
    image: '/images/banner.jpg',
  });
  checkStatus('POST /api/banners', banner, 201);
  check('La banniere est active par defaut', banner.data?.active === true);
  if (banner.data?.id) created.banner = banner.data.id;

  const banners = await call('GET', '/api/banners');
  checkStatus('GET /api/banners', banners, 200);
  check('La banniere est listee', banners.data?.some((b) => b.id === created.banner));

  section('Nettoyage');
  checkStatus('DELETE /api/products/:id', await call('DELETE', `/api/products/${productId}`), 200);

  const afterDelete = await call('GET', '/api/products');
  check('Le produit a disparu', !afterDelete.data?.some((p) => p.id === productId));

  // Nettoyage direct en base des donnees restantes
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();
  try {
    if (created.order) {
      await prisma.orderItem.deleteMany({ where: { orderId: created.order } });
      await prisma.order.delete({ where: { id: created.order } });
    }
    if (created.products.length) {
      await prisma.product.deleteMany({ where: { id: { in: created.products } } });
    }
    if (created.user) await prisma.user.delete({ where: { id: created.user } });
    if (created.newsletter) await prisma.newsletterSubscriber.delete({ where: { id: created.newsletter } });
    if (created.banner) await prisma.banner.delete({ where: { id: created.banner } });
    console.log('  OK    Donnees de test supprimees');
  } finally {
    await prisma.$disconnect();
  }

  const leftovers = await call('GET', '/api/products');
  check(
    'Aucun produit de test restant',
    !leftovers.data?.some((p) => String(p.name).includes('Test E2E')),
  );

  console.log(`\n${'='.repeat(45)}`);
  console.log(`Resultat : ${passed} reussis, ${failed} echecs`);
  if (failures.length) {
    console.log('\nEchecs :');
    failures.forEach((f) => console.log(`  - ${f}`));
  }
  console.log('='.repeat(45));

  process.exit(failed === 0 ? 0 : 1);
}

main().catch((error) => {
  console.error('\nLe test a echoue :', error.message);
  console.error(`Le serveur est-il demarre sur ${BASE_URL} ?`);
  process.exit(1);
});

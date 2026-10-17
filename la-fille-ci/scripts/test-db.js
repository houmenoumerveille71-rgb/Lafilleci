const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // 1. Lecture de tous les modeles
  const counts = {
    product: await prisma.product.count(),
    user: await prisma.user.count(),
    order: await prisma.order.count(),
    newsletterSubscriber: await prisma.newsletterSubscriber.count(),
    banner: await prisma.banner.count(),
    categoryBanner: await prisma.categoryBanner.count(),
    instagramPost: await prisma.instagramPost.count(),
  };
  console.log('Comptages:', counts);

  // 2. Ecriture : utilisateur + produit + commande + wishlist
  const user = await prisma.user.create({
    data: { email: 'test-db@lafille-ci.com', firstName: 'Test', isAdmin: false },
  });
  const product = await prisma.product.create({
    data: {
      name: 'Produit Test',
      price: '1000 $',
      category: 'Test',
      image: '/images/test.jpg',
      stock: 5,
    },
  });
  const order = await prisma.order.create({
    data: {
      userId: user.id,
      email: user.email,
      firstName: 'Test',
      lastName: 'User',
      address: '1 rue Test',
      city: 'Cotonou',
      zipCode: '01000',
      country: 'Benin',
      total: 2000,
      status: 'paid',
      orderNumber: 'TEST-001',
      items: { create: [{ productId: product.id, quantity: 2, price: 1000 }] },
    },
    include: { items: true, user: true },
  });
  await prisma.wishlistItem.create({
    data: { userId: user.id, productId: product.id },
  });
  console.log('Commande creee:', order.orderNumber, '| items:', order.items.length, '| user:', order.user.email);

  // 3. Relation : commandes du user
  const withOrders = await prisma.user.findUnique({
    where: { email: user.email },
    include: { orders: true, wishlistItems: { include: { product: true } } },
  });
  console.log('Relations user -> orders:', withOrders.orders.length, '| wishlist:', withOrders.wishlistItems.length);

  // 4. Transaction / rollback : on provoque une violation d'unicite
  //    (Order.orderNumber est UNIQUE) afin de vérifier que le moteur InnoDB
  //    annule bien l'ensemble de la transaction.
  const productsBefore = await prisma.product.count();
  try {
    await prisma.$transaction([
      prisma.product.create({ data: { name: 'Tmp', price: '1', category: 'T', image: 'x' } }),
      prisma.order.create({
        data: {
          userId: user.id,
          email: user.email,
          firstName: 'Test',
          lastName: 'User',
          address: '1 rue Test',
          city: 'Cotonou',
          zipCode: '01000',
          country: 'Benin',
          total: 1,
          // orderNumber en doublon -> contrainte UNIQUE violee
          orderNumber: 'TEST-001',
        },
      }),
    ]);
    console.log('ERREUR : la transaction aurait du etre annulee');
  } catch (e) {
    const productsAfter = await prisma.product.count();
    if (productsAfter === productsBefore) {
      console.log('Rollback transaction OK (contrainte UNIQUE respectee, aucun residu)');
    } else {
      console.log('ECHEC : produit "Tmp" non annule par le rollback');
    }
  }

  // 5. Nettoyage
  await prisma.wishlistItem.deleteMany({ where: { userId: user.id } });
  await prisma.orderItem.deleteMany({ where: { orderId: order.id } });
  await prisma.order.delete({ where: { id: order.id } });
  await prisma.product.delete({ where: { id: product.id } });
  await prisma.user.delete({ where: { id: user.id } });

  const final = {
    product: await prisma.product.count(),
    user: await prisma.user.count(),
    order: await prisma.order.count(),
  };
  console.log('Apres nettoyage:', final);
  console.log('TOUT EST OK');
}

main()
  .catch((e) => {
    console.error('ECHEC:', e.message);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
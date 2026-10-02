import prisma from '@/lib/prisma';

async function getStats() {
  const totalOrders = await prisma.order.count();
  const totalRevenue = await prisma.order.aggregate({
    _sum: { total: true },
    where: { status: 'paid' },
  });
  const totalCustomers = await prisma.user.count();
  const totalProducts = await prisma.product.count();
  const pendingOrders = await prisma.order.count({ where: { status: 'pending' } });
  const paidOrders = await prisma.order.count({ where: { status: 'paid' } });

  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: 'desc' } },
    take: 5,
  });

  return {
    totalOrders,
    totalRevenue: totalRevenue._sum.total || 0,
    totalCustomers,
    totalProducts,
    pendingOrders,
    paidOrders,
    recentOrders,
    topProducts,
  };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
        Tableau de Bord
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Commandes</p>
          <p className="text-3xl font-serif text-amber-100">{stats.totalOrders}</p>
          <p className="text-xs text-stone-500 mt-1">{stats.pendingOrders} en attente</p>
        </div>
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Revenu</p>
          <p className="text-3xl font-serif text-amber-100">{stats.totalRevenue.toLocaleString()} FCFA</p>
        </div>
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Clients</p>
          <p className="text-3xl font-serif text-amber-100">{stats.totalCustomers}</p>
        </div>
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <p className="text-xs uppercase tracking-widest text-stone-400 mb-2">Produits</p>
          <p className="text-3xl font-serif text-amber-100">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Dernières Commandes
          </h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order: any) => (
              <div key={order.id} className="flex justify-between items-center text-sm border-b border-stone-800 pb-2">
                <div>
                  <p className="text-amber-100">#{order.id} - {order.firstName} {order.lastName}</p>
                  <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-200">{order.total.toLocaleString()} FCFA</p>
                  <p className={`text-xs ${order.status === 'paid' ? 'text-green-400' : 'text-amber-400'}`}>
                    {order.status}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Produits les Plus Vendus
          </h2>
          <div className="space-y-3">
            {stats.topProducts.map((item: any, index: any) => (
              <div key={item.productId} className="flex justify-between items-center text-sm border-b border-stone-800 pb-2">
                <p className="text-amber-100">Produit #{item.productId}</p>
                <p className="text-amber-200">{item._sum.quantity} ventes</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

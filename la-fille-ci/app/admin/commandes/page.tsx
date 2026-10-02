import prisma from '@/lib/prisma';
import Link from 'next/link';

async function getOrders() {
  const orders = await prisma.order.findMany({
    include: { user: true, items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return orders;
}

export default async function AdminCommandesPage() {
  const orders = await getOrders();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400';
      case 'paid': return 'text-green-400';
      case 'shipped': return 'text-blue-400';
      case 'delivered': return 'text-green-400';
      case 'canceled': return 'text-red-400';
      default: return 'text-stone-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'paid': return 'Payée';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'canceled': return 'Annulée';
      default: return status;
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
        Gestion des Commandes
      </h1>

      <div className="bg-stone-900 border border-amber-900/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-800 border-b border-amber-900/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">ID</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Client</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Date</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Total</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Statut</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {orders.map((order: any) => (
              <tr key={order.id} className="hover:bg-stone-800/50">
                <td className="px-6 py-4 text-amber-100">#{order.id}</td>
                <td className="px-6 py-4">
                  <p className="text-amber-100">{order.firstName} {order.lastName}</p>
                  <p className="text-xs text-stone-500">{order.email}</p>
                </td>
                <td className="px-6 py-4 text-stone-400">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-amber-200">{order.total.toLocaleString()} FCFA</td>
                <td className="px-6 py-4">
                  <span className={`${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <Link href={`/admin/commandes/${order.id}`} className="text-amber-400 hover:text-amber-300 text-xs">
                    Détails
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

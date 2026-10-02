import prisma from '@/lib/prisma';

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id: parseInt(id) },
    include: { user: true, items: { include: { product: true } } },
  });
  return order;
}

const statusOptions = [
  { value: 'pending', label: 'En attente' },
  { value: 'paid', label: 'Payée' },
  { value: 'shipped', label: 'Expédiée' },
  { value: 'delivered', label: 'Livrée' },
  { value: 'canceled', label: 'Annulée' },
];

export default async function AdminOrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return (
      <div>
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
          Commande introuvable
        </h1>
      </div>
    );
  }

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

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase">
          Commande #{order.id}
        </h1>
        <span className={`text-sm uppercase tracking-widest ${getStatusColor(order.status)}`}>
          {statusOptions.find(s => s.value === order.status)?.label || order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Info */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Informations Client
          </h2>
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-stone-400">Nom complet</p>
              <p className="text-amber-100">{order.firstName} {order.lastName}</p>
            </div>
            <div>
              <p className="text-stone-400">Email</p>
              <p className="text-amber-100">{order.email}</p>
            </div>
            <div>
              <p className="text-stone-400">Téléphone</p>
              <p className="text-amber-100">{order.phone || '-'}</p>
            </div>
            <div>
              <p className="text-stone-400">Adresse</p>
              <p className="text-amber-100">{order.address}</p>
              <p className="text-amber-100">{order.zipCode} {order.city}</p>
              <p className="text-amber-100">{order.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Articles
          </h2>
          <div className="space-y-3">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm border-b border-stone-800 pb-2">
                <div>
                  <p className="text-amber-100">{item.product.name}</p>
                  <p className="text-xs text-stone-500">Quantité: {item.quantity}</p>
                </div>
                <p className="text-amber-200">{(item.price * item.quantity).toLocaleString()} FCFA</p>
              </div>
            ))}
            <div className="border-t border-amber-900/20 pt-3 mt-3">
              <div className="flex justify-between">
                <span className="text-amber-200 uppercase tracking-widest">Total</span>
                <span className="text-xl font-mono text-amber-400">{order.total.toLocaleString()} FCFA</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Status */}
      <div className="mt-8 bg-stone-900 border border-amber-900/20 p-6">
        <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
          Mettre à Jour le Statut
        </h2>
        <form id="update-status-form" className="flex gap-4">
          <select
            id="status-select"
            defaultValue={order.status}
            className="bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
          >
            Mettre à Jour
          </button>
        </form>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('update-status-form')?.addEventListener('submit', async (e) => {
              e.preventDefault();
              const status = document.getElementById('status-select')?.value;
              await fetch('/api/admin/commandes/${order.id}', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
              });
              location.reload();
            });
          `,
        }}
      />
    </div>
  );
}

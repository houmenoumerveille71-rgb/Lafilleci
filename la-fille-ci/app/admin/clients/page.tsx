import prisma from '@/lib/prisma';

async function getClients() {
  const users = await prisma.user.findMany({
    include: { orders: true },
    orderBy: { createdAt: 'desc' },
  });
  return users;
}

export default async function AdminClientsPage() {
  const clients = await getClients();

  return (
    <div>
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
        Gestion des Clients
      </h1>

      <div className="bg-stone-900 border border-amber-900/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-800 border-b border-amber-900/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">ID</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Nom</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Email</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Téléphone</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Inscription</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Commandes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {clients.map((client: any) => (
              <tr key={client.id} className="hover:bg-stone-800/50">
                <td className="px-6 py-4 text-amber-100">#{client.id}</td>
                <td className="px-6 py-4 text-amber-100">
                  {client.firstName} {client.lastName}
                </td>
                <td className="px-6 py-4 text-stone-400">{client.email}</td>
                <td className="px-6 py-4 text-stone-400">{client.phone || '-'}</td>
                <td className="px-6 py-4 text-stone-400">
                  {new Date(client.createdAt).toLocaleDateString('fr-FR')}
                </td>
                <td className="px-6 py-4 text-amber-200">{client.orders.length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

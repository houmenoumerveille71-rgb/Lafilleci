import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function CommandesPage() {
  const session = (await getServerSession(authOptions as any)) as {
    user?: { id?: string | number };
  } | null;

  if (!session?.user?.id) {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
        <Header />
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mb-4">
            Accès restreint
          </h2>
          <p className="text-stone-400 mb-8">Vous devez être connecté pour consulter vos commandes.</p>
          <Link 
            href="/login"
            className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
          >
            Se Connecter
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  const orders = await prisma.order.findMany({
    where: { userId: Number(session.user.id) },
    include: { items: { include: { product: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      default: return status;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-amber-400';
      case 'shipped': return 'text-blue-400';
      case 'delivered': return 'text-green-400';
      default: return 'text-stone-400';
    }
  };

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Historique
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Mes Commandes
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm mb-6">Vous n&apos;avez pas encore passé de commande.</p>
            <Link 
              href="/"
              className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
            >
              Découvrir la Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-stone-950 border border-amber-900/20 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-xs text-stone-400 mb-1">Commande #{order.id}</p>
                    <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
                  </div>
                  <div className="text-right">
                    <p className={`text-xs uppercase tracking-widest ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </p>
                    <p className="text-sm font-mono text-amber-400 mt-1">{order.total.toLocaleString()} FCFA</p>
                  </div>
                </div>

                <div className="border-t border-amber-900/20 pt-4">
                  <div className="space-y-3">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <div>
                          <span className="text-amber-100">{item.product.name}</span>
                          <span className="text-stone-500 text-xs ml-2">x{item.quantity}</span>
                        </div>
                        <span className="text-amber-200">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-amber-900/20 mt-4 pt-4">
                  <p className="text-xs text-stone-400">
                    Livraison : {order.address}, {order.city}, {order.zipCode}, {order.country}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

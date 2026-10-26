'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const STATUS_STEPS = [
  { key: 'pending', label: 'Commande reçue' },
  { key: 'processing', label: 'En préparation' },
  { key: 'shipped', label: 'Expédiée' },
  { key: 'delivered', label: 'Livrée' },
  { key: 'cancelled', label: 'Annulée' },
];

const getStepIndex = (status: string) => {
  return STATUS_STEPS.findIndex((s) => s.key === status);
};

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [found, setFound] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFound(false);

    try {
      const res = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Commande introuvable');
      } else {
        const data = await res.json();
        setOrder(data);
        setFound(true);
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order ? getStepIndex(order.status) : -1;

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Suivi de commande
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-wider text-amber-100 uppercase mt-1">
            Où en est ma commande ?
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8 mb-12">
          <form onSubmit={handleSearch} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Numéro de commande
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="CMD-XXXX"
                  className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Email de commande
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="vous@email.com"
                  className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-950 border border-red-700 text-red-100 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
            >
              {loading ? 'Recherche...' : 'Vérifier ma commande'}
            </button>
          </form>
        </div>

        {found && order && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Status */}
            <div className="lg:col-span-2">
              <div className="bg-stone-950 border border-amber-900/20 p-6">
                <h3 className="text-xl font-serif tracking-widest text-amber-100 uppercase mb-6">
                  Statut de la commande
                </h3>

                <div className="flex items-center gap-2 mb-8">
                  <span className={`text-xs font-mono font-bold ${order.status === 'delivered' ? 'text-amber-500' : 'text-stone-500'}`}>
                    #{order.orderNumber}
                  </span>
                  <span className={`text-xs text-stone-400`}>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center gap-4">
                  {STATUS_STEPS.map((step, index) => (
                    <div key={step.key} className="flex flex-col items-center gap-2 relative group">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index < currentStepIndex
                            ? 'bg-amber-500 text-black'
                            : index === currentStepIndex
                            ? 'bg-amber-800 text-amber-100 border-2 border-amber-400'
                            : 'bg-transparent text-stone-600 border border-stone-700'
                        }`}
                      >
                        {index < currentStepIndex ? '✓' : index === currentStepIndex ? '○' : '○'}
                      </div>
                      <span className={`text-xs uppercase tracking-widest ${
                        index <= currentStepIndex ? 'text-amber-100 font-bold' : 'text-stone-500'
                      }`}>
                        {step.label}
                      </span>
                      {index < STATUS_STEPS.length - 1 && (
                        <div
                          className={`h-1 w-8 ${index < currentStepIndex ? 'bg-amber-500' : 'bg-stone-800'}`}
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <span className={`text-xs font-mono font-bold ${order.status === 'delivered' ? 'text-amber-500' : order.status === 'cancelled' ? 'text-red-500' : 'text-amber-100'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="lg:col-span-1">
              <div className="bg-stone-950 border border-amber-900/20 p-6 sticky top-24">
                <h3 className="text-xl font-serif tracking-widest text-amber-100 uppercase mb-6">
                  Détails
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nom</span>
                    <span className="text-stone-300">{order.firstName} {order.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Email</span>
                    <span className="text-stone-300">{order.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Adresse</span>
                    <span className="text-stone-300 text-xs">
                      {order.address}, {order.city}, {order.zipCode}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Téléphone</span>
                    <span className="text-stone-300">{order.phone || 'Non renseigné'}</span>
                  </div>
                  <div className="flex justify-between border-t border-amber-900/20 pt-4">
                    <span className="text-stone-500">Total</span>
                    <span className="text-amber-500 font-bold">{order.total} FCFA</span>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs uppercase tracking-widest text-amber-200 mb-3">
                    Articles
                  </h4>
                  <div className="space-y-3">
                    {order.items?.map((item: any) => (
                      <div key={item.id} className="flex gap-3">
                        {item.product?.image && (
                          <div className="w-12 h-12 bg-stone-800 border border-amber-900/20 rounded overflow-hidden">
                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="text-xs text-stone-300 font-bold">{item.product?.name || 'Produit'}</div>
                          <div className="text-[10px] text-stone-500">
                            Qté: {item.quantity} × {item.price} FCFA
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

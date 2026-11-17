'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function FedapayReturnPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [status, setStatus] = useState<string>('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId) { setLoading(false); return; }
    fetch(`/api/orders/${orderId}/status`)
      .then((r) => r.json())
      .then((data) => setStatus(data.status || 'pending'))
      .catch(() => setStatus('pending'))
      .finally(() => setLoading(false));
  }, [orderId]);

  const isSuccess = status === 'paid';
  const isFailed = status === 'failed' || status === 'canceled';

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      <Header />
      <section className="py-16 px-6 max-w-3xl mx-auto text-center">
        {loading ? (
          <p className="text-stone-400">Vérification du paiement...</p>
        ) : isSuccess ? (
          <>
            <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-4">Paiement réussi</h1>
            <p className="text-stone-400 mb-8">Votre commande #{orderId} a été confirmée.</p>
          </>
        ) : isFailed ? (
          <>
            <h1 className="text-3xl font-serif tracking-widest text-red-400 uppercase mb-4">Paiement échoué</h1>
            <p className="text-stone-400 mb-8">Le paiement de la commande #{orderId} n'a pas abouti.</p>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-4">Paiement en attente</h1>
            <p className="text-stone-400 mb-8">Le paiement de la commande #{orderId} est en cours de traitement.</p>
          </>
        )}
        <Link href="/" className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition">
          Retour à la boutique
        </Link>
      </section>
      <Footer />
    </div>
  );
}

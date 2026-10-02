import { Suspense } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

function SuccessContent() {
  const url = new URL(typeof window !== 'undefined' ? window.location.href : 'http://localhost:3000');
  const orderId = url.searchParams.get('orderId');

  return (
    <div className="text-center">
      <div className="w-16 h-16 bg-green-950 border border-green-700 rounded-full flex items-center justify-center mx-auto mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-green-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      </div>
      <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mb-4">
        Commande Confirmée
      </h2>
      <p className="text-stone-400 mb-2">Merci pour votre achat !</p>
      {orderId && (
        <p className="text-sm text-stone-500 mb-8">Commande #{orderId}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href="/commandes"
          className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
        >
          Voir mes commandes
        </Link>
        <Link 
          href="/"
          className="inline-block bg-transparent hover:bg-stone-900 text-amber-100 border border-amber-900/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
        >
          Continuer vos achats
        </Link>
      </div>
    </div>
  );
}

export default function CommandeSuccessPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <Suspense fallback={<div className="text-center text-stone-400">Chargement...</div>}>
          <SuccessContent />
        </Suspense>
      </section>

      <Footer />

    </div>
  );
}

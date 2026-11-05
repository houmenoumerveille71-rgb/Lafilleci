import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

const faqs = [
  { q: 'Comment passer une commande ?', a: 'Ajoutez vos produits au panier puis validez la commande sur la page /commande.' },
  { q: 'Quels moyens de paiement sont acceptés ?', a: 'Le paiement par carte via Stripe est disponible.' },
  { q: 'Comment suivre ma commande ?', a: 'Utilisez la page /commande/suivi avec votre numéro de commande.' },
  { q: 'Puis-je annuler une commande ?', a: 'Contactez-nous rapidement pour toute annulation.' },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      <Header />
      <section className="py-16 px-6 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mb-8">FAQ</h1>
        <div className="space-y-6">
          {faqs.map((f, i) => (
            <div key={i} className="bg-stone-950 border border-amber-900/20 p-6">
              <h3 className="text-amber-100 font-serif mb-2">{f.q}</h3>
              <p className="text-stone-400 text-sm">{f.a}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link href="/" className="text-amber-400 hover:text-amber-300 text-xs uppercase tracking-widest">Retour à l'accueil</Link>
        </div>
      </section>
      <Footer />
    </div>
  );
}

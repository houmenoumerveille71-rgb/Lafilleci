import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ExpeditionsPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Livraison
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Expéditions
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8 space-y-6 text-sm text-stone-400 leading-relaxed">
          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Délais de Livraison</h3>
            <p>France : 2 à 3 jours ouvrables<br />Europe : 3 à 5 jours ouvrables<br />International : 5 à 10 jours ouvrables</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Frais de Port</h3>
            <p>Livraison standard offerte dès 500 FCFA d&apos;achat.<br />Pour les commandes inférieures, les frais de port s&apos;élèvent à 25 FCFA.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Suivi de Commande</h3>
            <p>Vous recevrez un email de confirmation avec un numéro de suivi dès que votre commande sera expédiée. Vous pourrez suivre votre colis en temps réel sur le site du transporteur.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Livraison Express</h3>
            <p>Une option de livraison express est disponible au moment du paiement pour les commandes en France métropolitaine. Délai : 24h à 48h.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Contact</h3>
            <p>Pour toute question concernant une livraison, contactez-nous à : livraison@lafille-ci.com</p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RetoursPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Service Après-Vente
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Retours & Remboursements
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8 space-y-6 text-sm text-stone-400 leading-relaxed">
          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Délai de Retour</h3>
            <p>Vous disposez de 30 jours à compter de la réception de votre commande pour effectuer un retour.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Conditions</h3>
            <p>Les articles doivent être dans leur état d&apos;origine, non utilisés et avec toutes les étiquettes attachées. Les articles soldés ou personnalisés ne sont pas repris.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Remboursement</h3>
            <p>Les remboursements sont traités sous 7 à 10 jours ouvrables après réception et inspection des articles retournés. Le montant sera remboursé sur le moyen de paiement utilisé lors de l&apos;achat.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Échanges</h3>
            <p>Nous n&apos;effectuons pas d&apos;échanges directs. Veuillez retourner l&apos;article et passer une nouvelle commande pour l&apos;article souhaité.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Contact</h3>
            <p>Pour toute question concernant un retour, contactez-nous à : retours@lafille-ci.com</p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AProposPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Découvrez
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            À Propos
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-stone-950 border border-amber-900/20 p-8 md:p-12">
            <h3 className="text-2xl font-serif tracking-widest text-amber-100 uppercase mb-6">
              Notre Histoire
            </h3>
            <div className="space-y-6 text-sm text-stone-400 leading-relaxed">
              <p>
                Fondée avec une vision de l&apos;excellence et de l&apos;élégance, <strong className="text-amber-200">La Fille-Ci</strong> est née de la passion pour l&apos;artisanat de luxe et le design contemporain.
              </p>
              <p>
                Notre atelier réunit des artisans d&apos;exception qui perpétuent les traditions tout en embrassant l&apos;innovation. Chaque pièce que nous créons est le fruit d&apos;un savoir-faire transmis à travers les générations.
              </p>
              <p>
                Nous sélectionnons les matériaux les plus nobles et travaillons avec les meilleurs fournisseurs pour garantir une qualité irréprochable. Notre engagement envers l&apos;excellence se reflète dans chaque détail.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="text-center">
              <div className="text-4xl font-serif text-amber-400 mb-2">15+</div>
              <div className="text-xs uppercase tracking-widest text-stone-400">Années d&apos;Expérience</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-amber-400 mb-2">100%</div>
              <div className="text-xs uppercase tracking-widest text-stone-400">Artisanat Français</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-serif text-amber-400 mb-2">50+</div>
              <div className="text-xs uppercase tracking-widest text-stone-400">Pays Livrés</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

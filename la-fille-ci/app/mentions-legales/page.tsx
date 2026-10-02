import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Informations Légales
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Mentions Légales
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8 space-y-6 text-sm text-stone-400 leading-relaxed">
          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Éditeur du Site</h3>
            <p>La Fille-Ci<br />Premium Luxury Atelier<br />Paris, France</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Directeur de la Publication</h3>
            <p>La Fille-Ci</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Hébergement</h3>
            <p>Vercel Inc.<br />340 S Lemon Ave #4133<br />Walnut, CA 91789, USA</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Propriété Intellectuelle</h3>
            <p>L&apos;ensemble du contenu de ce site (textes, images, vidéos) est la propriété exclusive de La Fille-Ci. Toute reproduction est interdite sans autorisation préalable.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Données Personnelles</h3>
            <p>Conformément au RGPD, vous disposez d&apos;un droit d&apos;accès, de rectification et de suppression de vos données personnelles.</p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Protection des Données
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Politique de Confidentialité
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8 space-y-6 text-sm text-stone-400 leading-relaxed">
          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Collecte des Données</h3>
            <p>Nous collectons les données personnelles que vous nous fournissez lors de votre inscription, de vos achats ou de vos communications avec notre service client.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Utilisation des Données</h3>
            <p>Vos données sont utilisées pour traiter vos commandes, améliorer votre expérience et, avec votre consentement, vous envoyer des communications commerciales.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Protection des Données</h3>
            <p>Nous mettons en œuvre des mesures de sécurité techniques et organisationnelles pour protéger vos données contre tout accès, modification ou divulgation non autorisés.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Cookies</h3>
            <p>Notre site utilise des cookies pour améliorer votre navigation. Vous pouvez configurer votre navigateur pour refuser les cookies, mais certaines fonctionnalités peuvent être limitées.</p>
          </div>

          <div>
            <h3 className="text-amber-200 uppercase tracking-widest mb-3">Contact</h3>
            <p>Pour toute question concernant vos données personnelles, contactez-nous à : privacy@lafille-ci.com</p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

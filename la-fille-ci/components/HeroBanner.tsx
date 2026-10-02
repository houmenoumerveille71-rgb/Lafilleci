type BannerProps = {
  title: string;
  subtitle: string;
  imageAlt: string;
};

function Banner({ title, subtitle, imageAlt }: BannerProps) {
  return (
    <div className="relative h-[480px] md:h-[580px] bg-stone-900 border border-amber-900/20 flex flex-col items-center justify-center text-center p-8 overflow-hidden group">
      {/* Remplacez ce div par votre balise <img src="..." /> */}
      <div className="absolute inset-0 bg-stone-900 flex items-center justify-center text-stone-700 text-sm">
        [ Votre Image : {imageAlt} ]
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 z-10" />
      
      <div className="relative z-20 max-w-sm">
        <h2 className="text-3xl md:text-4xl font-serif text-amber-100 tracking-wider mb-2 uppercase">
          {title}
        </h2>
        <p className="text-xs text-amber-200/80 tracking-widest uppercase mb-6 font-light">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

export default function HeroBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2 bg-stone-900/40">
      
      {/* Bannière Gauche */}
      <Banner 
        title="L'Élégance en Mouvement" 
        subtitle="Découvrir la Collection Sport" 
        imageAlt="Collection Sport" 
      />

      {/* Bannière Droite */}
      <Banner 
        title="Le Chic Urbain" 
        subtitle="Découvrir la Collection Sortie" 
        imageAlt="Collection Sortie" 
      />

    </section>
  );
}

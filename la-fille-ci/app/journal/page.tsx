import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: "L&apos;Élégance Intemporelle",
      excerpt: "Découvrez les secrets d&apos;un style qui traverse les époques avec grâce et sophistication.",
      date: '15 Janvier 2026',
      category: 'Style'
    },
    {
      id: 2,
      title: "Artisanat et Savoir-Faire",
      excerpt: "Plongée dans l&apos;atelier de nos artisans, où chaque pièce est créée avec passion.",
      date: '10 Janvier 2026',
      category: 'Artisanat'
    },
    {
      id: 3,
      title: "Tendances Luxe 2026",
      excerpt: "Les incontournables de la saison pour une garde-robe raffinée et moderne.",
      date: '5 Janvier 2026',
      category: 'Tendances'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Blog
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Journal
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article) => (
            <div key={article.id} className="group cursor-pointer">
              <div className="aspect-video bg-stone-900 border border-amber-900/20 mb-4 flex items-center justify-center text-stone-600 text-xs">
                [ Image Article ]
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-amber-500/80">
                {article.category}
              </span>
              <h3 className="text-lg font-serif tracking-wider text-amber-100 uppercase mt-1 mb-2 group-hover:text-amber-300 transition">
                {article.title}
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                {article.excerpt}
              </p>
              <span className="text-[10px] text-stone-500 uppercase tracking-widest">
                {article.date}
              </span>
            </div>
          ))}
        </div>
      </section>

      <Footer />

    </div>
  );
}

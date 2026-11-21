import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function JournalPage() {
  const articles = [
    {
      id: 1,
      title: "L'ÉLÉGANCE AU QUOTIDIEN",
      excerpt: "Découvrez nos inspirations mode et nos conseils pour créer des looks féminins, élégants et tendance, sans vous ruiner.",
      date: '15 Janvier 2026',
      category: 'STYLE & INSPIRATION',
      image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800'
    },
    {
      id: 2,
      title: "LE CHARME DU FAIT MAIN",
      excerpt: "Plongez dans l'univers du crochet et découvrez des créations uniques qui allient créativité, authenticité et féminité.",
      date: '10 Janvier 2026',
      category: 'ART & CRÉATION',
      image: 'https://images.unsplash.com/photo-1594633312681-425c3e9c0e6b?w=800'
    },
    {
      id: 3,
      title: "LES INDISPENSABLES DE VOTRE DRESSING",
      excerpt: "Explorez les tendances du moment, les pièces incontournables et les idées de looks pour affirmer votre personnalité.",
      date: '5 Janvier 2026',
      category: 'TENDANCES & COLLECTIONS',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800'
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
                <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
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

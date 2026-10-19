'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { Product } from '@/lib/products';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

interface CategoryBanner {
  id: number;
  title: string;
  slug: string;
  image: string;
  active: boolean;
}

interface InstagramPost {
  id: number;
  image: string;
  alt: string | null;
  active: boolean;
}

const categories = [
  { slug: 'nouveautes', label: 'Nouveautés' },
  { slug: 'sortie', label: 'Habits de Sortie' },
  { slug: 'sport', label: 'Tenues de Sport' },
  { slug: 'crochet', label: 'Tenues en Crochet' },
  { slug: 'vente', label: 'Vente' },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categoryBanners, setCategoryBanners] = useState<CategoryBanner[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, bannersRes, categoryBannersRes, instagramRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/banners'),
          fetch('/api/category-banners'),
          fetch('/api/instagram'),
        ]);

        if (productsRes.ok) setProducts(await productsRes.json());
        if (bannersRes.ok) setBanners(await bannersRes.json());
        if (categoryBannersRes.ok) setCategoryBanners(await categoryBannersRes.json());
        if (instagramRes.ok) setInstagramPosts(await instagramRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = Array.isArray(products)
    ? activeCategory === 'all'
      ? products
      : activeCategory === 'nouveautes' || activeCategory === 'vente'
        ? products
        : products.filter((p) => p.category === categories.find(c => c.slug === activeCategory)?.label)
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-400 text-sm">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      {/* Category Filter */}
      <section className="py-8 px-6 max-w-7xl mx-auto">
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest transition ${
              activeCategory === 'all'
                ? 'bg-amber-800 text-amber-100 border border-amber-600'
                : 'bg-transparent text-stone-400 border border-stone-700 hover:border-amber-500 hover:text-amber-300'
            }`}
          >
            Tout
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              className={`px-3 sm:px-6 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest transition ${
                activeCategory === cat.slug
                  ? 'bg-amber-800 text-amber-100 border border-amber-600'
                  : 'bg-transparent text-stone-400 border border-stone-700 hover:border-amber-500 hover:text-amber-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </section>

       {/* Hero Banners */}
       <section className="grid gap-4 p-2 bg-stone-900/40">
         {/* Mobile: 1 column, Tablet: 2 columns, Desktop: 3 columns */}
         <div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
           {banners.length > 0 ? (
             banners.map((banner) => (
               <div key={banner.id} className="relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] border border-amber-900/20 flex flex-col items-center justify-center text-center p-6 overflow-hidden group">
                 {banner.image ? (
                   <img 
                     src={banner.image} 
                     alt={banner.title} 
                     className="absolute inset-0 w-full h-full object-cover"
                   />
                 ) : null}
                 <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30 z-10" />
                 <div className="relative z-20 max-w-sm">
                   <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-amber-100 tracking-wider mb-2 uppercase">
                     {banner.title}
                   </h2>
                   <p className="text-sm sm:text-base text-amber-200/80 tracking-widest uppercase mb-4 font-light">
                     {banner.subtitle}
                   </p>
                 </div>
               </div>
             ))
           ) : (
             <>
               <div className="relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-sm">
                 [ Aucune bannière ]
               </div>
               <div className="relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-sm">
                 [ Aucune bannière ]
               </div>
               <div className="relative min-h-[200px] sm:min-h-[250px] lg:min-h-[300px] bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-sm">
                 [ Aucune bannière ]
               </div>
             </>
           )}
         </div>
       </section>

      {/* Bouton Tout Voir */}
      <div className="text-center py-6 bg-black">
        <button className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition">
          TOUT VOIR
        </button>
      </div>

      {/* Section Nouveautés */}
      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            {activeCategory === 'all' ? 'Nouveautés' : categories.find(c => c.slug === activeCategory)?.label || 'Collection'}
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            {activeCategory === 'all' ? 'Nouveautés' : categories.find(c => c.slug === activeCategory)?.label || 'Collection'}
          </h2>
          {activeCategory !== 'all' && (
            <h3 className="text-sm font-serif tracking-wider text-stone-400 uppercase mt-4 text-left border-b border-amber-900/20 pb-2">
              {categories.find(c => c.slug === activeCategory)?.label || ''}
            </h3>
          )}
        </div>

          {/* Grille Cartes Produits */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
           {filteredProducts.map((item) => (
             <ProductCard 
               key={item.id} 
               name={item.name} 
               price={item.price} 
               image={item.image}
               stock={item.stock}
               description={item.description}
               category={item.category}
             />
           ))}
         </div>
      </section>

      {/* Collections en Vedette / Grille Catégories */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-amber-900/20">
        <div className="mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80 block">
            Collections en Vedette
          </span>
          <h2 className="text-2xl font-serif tracking-wider text-amber-100 uppercase">
            Explorer par Catégorie
          </h2>
        </div>

         <div className="grid gap-6">
           <div className="sm:grid-cols-2 lg:grid-cols-3">
             {categoryBanners.length > 0 ? (
               categoryBanners.map((banner) => (
                 <div key={banner.id} className="relative min-h-[60px] sm:min-h-[80px] lg:min-h-[64] bg-stone-900 border border-amber-900/30 flex items-center justify-center group cursor-pointer overflow-hidden">
                   {banner.image ? (
                     <img src={banner.image} alt={banner.title} className="absolute inset-0 w-full h-full object-cover" />
                   ) : null}
                   <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition" />
                   <h3 className="relative z-10 text-sm sm:text-base lg:text-xl font-serif tracking-widest text-amber-100 uppercase">
                     {banner.title}
                   </h3>
                 </div>
               ))
             ) : (
               <>
                 <div className="relative min-h-[60px] sm:min-h-[80px] lg:min-h-[64] bg-stone-900 border border-amber-900/30 flex items-center justify-center text-stone-700 text-xs">
                   [ Aucune image ]
                 </div>
                 <div className="bg-stone-950 border border-amber-900/30 p-4 sm:p-6 flex flex-col items-center justify-center text-center">
                   <p className="text-[10px] sm:text-xs tracking-[0.25em] text-amber-400 uppercase mb-2">
                     Ce que disent nos clients
                   </p>
                   <h3 className="text-sm sm:text-base lg:text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
                     Vêtements de Sport
                   </h3>
                   <blockquote className="text-xs sm:text-sm italic text-stone-400 mb-3 font-light">
                     &ldquo;J&rsquo;adore la coupe et la qualit&eacute;, une vraie touche d&rsquo;&eacute;l&eacute;gance au quotidien.&rdquo;
                   </blockquote>
                   <div className="text-amber-400 text-xs tracking-widest">
                     ★★★★★
                   </div>
                 </div>
                 <div className="relative min-h-[60px] sm:min-h-[80px] lg:min-h-[64] bg-stone-900 border border-amber-900/30 flex items-center justify-center text-stone-700 text-xs">
                   [ Aucune image ]
                 </div>
               </>
             )}
           </div>
         </div>
      </section>

      {/* Feed Social / Grille Instagram */}
      <section className="py-16 px-6 max-w-7xl mx-auto border-t border-amber-900/20">
        <div className="text-center mb-8">
          <h2 className="text-xl font-serif tracking-widest text-amber-100 uppercase">
            Suivez @lafillestore
          </h2>
          <Link href="https://instagram.com/lafillestore" target="_blank" className="text-xs tracking-wider text-amber-400/80 uppercase mt-1 hover:text-amber-300 transition">
            Suivez-nous @lafilleci
          </Link>
        </div>

         {instagramPosts.length > 0 ? (
           <div className="grid gap-2">
             <div className="sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
               {instagramPosts.map((post) => (
                 <div key={post.id} className="aspect-square bg-stone-900 border border-amber-900/20 overflow-hidden">
                   {post.image ? (
                     <img src={post.image} alt={post.alt || ''} className="w-full h-full object-cover hover:border-amber-500/50 transition cursor-pointer" />
                   ) : null}
                 </div>
               ))}
             </div>
           </div>
         ) : (
           <div className="grid gap-2">
             <div className="sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
               {Array.from({ length: 12 }).map((_, i) => (
                 <div key={i} className="aspect-square bg-stone-900 border border-amber-900/20 flex items-center justify-center text-[10px] sm:text-xs text-stone-700">
                   [ Aucune image ]
                 </div>
               ))}
             </div>
           </div>
         )}
      </section>

      <Footer />

    </div>
  );
}

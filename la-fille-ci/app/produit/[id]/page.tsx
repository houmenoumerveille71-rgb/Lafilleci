import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProduct, getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Produit non trouvé | La Fille-Ci' };
  }
  return {
    title: `${product.name} | La Fille-Ci`,
    description: product.category,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const allProducts = await getProducts();
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-400 transition">Accueil</Link>
          <span>/</span>
          <span className="text-amber-200">{product.category}</span>
          <span>/</span>
          <span className="text-amber-100">{product.name}</span>
        </nav>

         <div className="grid gap-12">
           <div className="sm:grid-cols-2 lg:grid-cols-3">
             {/* Product Image */}
             <div className="relative aspect-w-3 aspect-h-4 bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-sm">
               {product.image ? (
                 <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
               ) : (
                 <span>[ Image {product.name} ]</span>
               )}
             </div>

             {/* Product Info */}
             <div className="flex flex-col justify-center">
               <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80 mb-2">
                 {product.category}
               </span>
               <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wider text-amber-100 uppercase mb-4">
                 {product.name}
               </h1>
               <p className="text-2xl font-mono text-amber-400 mb-8">
                 {product.price}
               </p>

               <div className="space-y-4 mb-8">
                 <p className="text-sm text-stone-400 leading-relaxed">
                   {product.description || 'Une pièce exceptionnelle qui allie élégance et raffinement. Confectionnée avec des matériaux de haute qualité, cette création incarne le savoir-faire de notre atelier de luxe.'}
                 </p>
               </div>

               <div className="flex gap-4">
                 <button className="flex-1 bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition">
                   Ajouter au Panier
                 </button>
                 <button className="px-6 py-3 border border-amber-900/40 text-stone-300 hover:border-amber-500 hover:text-white transition">
                   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                     <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.575-4.688-4.575-1.39 0-2.64.675-3.312 1.722-.672-1.047-1.922-1.722-3.312-1.722C7.099 3.675 5 5.765 5 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                   </svg>
                 </button>
               </div>
             </div>
           </div>
         </div>
      </section>

       {/* Related Products */}
       {relatedProducts.length > 0 && (
         <section className="py-16 px-6 max-w-7xl mx-auto border-t border-amber-900/20">
           <div className="text-center mb-12">
             <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
               Vous Aimerez Aussi
             </span>
             <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-widest text-amber-100 uppercase mt-1">
               Produits Similaires
             </h2>
           </div>

           <div className="grid gap-6">
             <div className="sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
               {relatedProducts.map((item) => (
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
           </div>
         </section>
       )}

      <Footer />

    </div>
  );
}

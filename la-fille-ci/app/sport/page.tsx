export const dynamic = 'force-dynamic';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';

export default async function SportPage() {
  const products = await getProducts();
  const sportProducts = products.filter(p => p.category === 'Tenues de Sport');

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Tenues de Sport
          </h2>
          <p className="text-sm text-stone-400 mt-4 max-w-2xl mx-auto">
            Performance et style pour vos moments sportifs. Des tenues qui allient confort et élégance.
          </p>
        </div>

        {sportProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sportProducts.map((item) => (
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
        )}
      </section>

      <Footer />

    </div>
  );
}

'use client';

import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Product } from '@/lib/products';

export default function WishlistPage() {
  const { items, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (product: Product) => {
    addToCart(product);
  };

  const handleRemove = (productId: number) => {
    removeFromWishlist(productId);
  };

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Favoris
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Ma Liste d&apos;Envies
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm mb-6">Votre liste d&apos;envies est vide.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {items.map((item) => (
              <div key={item.id} className="group relative flex flex-col">
                <div className="relative aspect-3/4 bg-stone-900 border border-amber-900/20 mb-4 overflow-hidden flex items-center justify-center text-stone-600 text-xs">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <span>[ Image {item.name} ]</span>
                  )}
                  <button 
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-3 right-3 text-stone-400 hover:text-amber-300 z-10"
                    aria-label="Retirer des favoris"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <h4 className="text-xs font-serif tracking-wider text-amber-100/90 mb-1">{item.name}</h4>
                <p className="text-xs font-mono text-amber-400/80 mb-4">{item.price}</p>
                <button 
                  onClick={() => handleAddToCart(item)}
                  className="bg-stone-900 border border-amber-900/40 text-[10px] uppercase tracking-wider py-2 text-amber-200 hover:bg-amber-900/40 transition"
                >
                  Ajouter au Panier
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

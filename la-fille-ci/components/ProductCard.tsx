'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { Product } from '@/lib/products';

interface ProductCardProps {
  name: string;
  price: string;
  image: string;
  stock?: number;
  description?: string;
  category?: string;
}

export default function ProductCard({ name, price, image, stock = 0, description = '', category = '' }: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const product: Product = {
    id: 0,
    name,
    price,
    category: category || '',
    image,
    stock,
  };

  const inWishlist = isInWishlist(0);
  const isOutOfStock = stock === 0;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(0);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="group relative flex flex-col">
      
       {/* Zone Image Produit */}
       <div className="relative aspect-w-3 aspect-h-4 bg-stone-900 border border-amber-900/20 mb-4 overflow-hidden flex items-center justify-center text-stone-600 text-xs">
         {image ? (
           <Image
             src={image}
             alt={name}
             fill
             sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
             className="object-cover group-hover:scale-105 transition duration-500"
             priority
           />
         ) : (
           <span>[ Image {name} ]</span>
         )}
         
         {/* Bouton Favoris */}
         <button 
           onClick={handleWishlistToggle}
           className={`absolute top-3 right-3 z-10 transition ${
             inWishlist ? 'text-amber-400' : 'text-stone-400 hover:text-amber-300'
           }`}
           aria-label="Ajouter aux favoris"
         >
           <svg xmlns="http://www.w3.org/2000/svg" fill={inWishlist ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.575-4.688-4.575-1.39 0-2.64.675-3.312 1.722-.672-1.047-1.922-1.722-3.312-1.722C7.099 3.675 5 5.765 5 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
           </svg>
         </button>
       </div>

       {/* Détails Produit */}
       <h4 className="text-xs sm:text-md font-serif tracking-wider text-amber-100/90 mb-1">
         {name}
       </h4>
       <p className="text-xs sm:text-md font-mono text-amber-400/80 mb-1">
         {price}
       </p>
       {stock !== undefined && (
         <p className={`text-[10px] sm:text-xs uppercase tracking-wider mb-4 ${isOutOfStock ? 'text-red-400' : 'text-stone-500'}`}>
           {isOutOfStock ? 'Rupture de stock' : `Stock: ${stock}`}
         </p>
       )}

       {/* Boutons d'Action */}
       <div className="grid grid-cols-2 gap-2 mt-auto">
         <button 
           onClick={() => setIsModalOpen(true)}
           className="border border-amber-900/40 text-[9px] sm:text-[10px] uppercase tracking-wider py-1.5 sm:py-2 text-stone-300 hover:border-amber-500 hover:text-white transition"
         >
           Aperçu Rapide
         </button>
         <button 
           onClick={handleAddToCart}
           disabled={isOutOfStock}
           className={`${isOutOfStock ? 'bg-stone-800 text-stone-500 cursor-not-allowed' : 'bg-stone-900 border border-amber-900/40 text-amber-200 hover:bg-amber-900/40'} text-[9px] sm:text-[10px] uppercase tracking-wider py-1.5 sm:py-2 transition`}
         >
           {isOutOfStock ? 'Indisponible' : 'Ajouter'}
         </button>
       </div>

      {/* Modale Aperçu Rapide */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setIsModalOpen(false)}>
          <div className="bg-stone-950 border border-amber-900/20 max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-1 md:grid-cols-2">
              
              {/* Image Produit */}
              <div className="aspect-square bg-stone-900 border-b md:border-b-0 md:border-r border-amber-900/20 flex items-center justify-center">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="50vw"
                    className="object-cover"
                    priority
                  />
                ) : (
                  <span className="text-stone-600 text-sm">[ Image {name} ]</span>
                )}
              </div>

           {/* Détails Produit */}
           <div className="p-6 sm:p-8 flex flex-col">
             <div className="flex justify-between items-start mb-4">
               <div>
                 {category && (
                   <p className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-500/80 mb-2">{category}</p>
                 )}
                 <h3 className="text-xl sm:text-2xl font-serif tracking-widest text-amber-100 uppercase">{name}</h3>
               </div>
               <button 
                 onClick={() => setIsModalOpen(false)}
                 className="text-stone-400 hover:text-amber-100 transition"
                 aria-label="Fermer"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                 </svg>
               </button>
             </div>

             <p className="text-2xl sm:text-3xl font-mono text-amber-400 mb-4">{price}</p>

             {description && (
               <p className="text-sm text-stone-300 mb-6 leading-relaxed">{description}</p>
             )}

             {stock !== undefined && (
               <p className={`text-xs uppercase tracking-wider mb-6 ${isOutOfStock ? 'text-red-400' : 'text-stone-500'}`}>
                 {isOutOfStock ? 'Rupture de stock' : `Stock disponible: ${stock}`}
               </p>
             )}

             <div className="mt-auto space-y-3">
               <button 
                 onClick={handleAddToCart}
                 disabled={isOutOfStock}
                 className={`w-full ${isOutOfStock ? 'bg-stone-800 text-stone-500 cursor-not-allowed' : 'bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40'} py-3 text-xs tracking-[0.25em] uppercase transition`}
               >
                 {isOutOfStock ? 'Indisponible' : 'Ajouter au Panier'}
               </button>
               <button 
                 onClick={handleWishlistToggle}
                 className={`w-full ${inWishlist ? 'bg-amber-900/40 text-amber-100 border border-amber-600/40' : 'bg-transparent text-stone-300 border border-stone-700 hover:border-amber-500 hover:text-amber-300'} py-3 text-xs tracking-[0.25em] uppercase transition`}
               >
                 {inWishlist ? 'Retirer des Favoris' : 'Ajouter aux Favoris'}
               </button>
             </div>
           </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

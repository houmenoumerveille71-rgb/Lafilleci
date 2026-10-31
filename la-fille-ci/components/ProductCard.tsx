
'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import type { Product } from '@/lib/products';

interface ProductCardProps {
  id?: number;
  name: string;
  price: string;
  image: string;
  images?: string[];
  stock?: number;
  description?: string;
  category?: string;
}

export default function ProductCard({
  id = 0,
  name,
  price,
  image,
  images = [],
  stock = 0,
  description = '',
  category = '',
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const product: Product = {
    id: id || 0,
    name,
    price,
    category,
    image,
    images,
    stock,
    description,
  };

  const productImages = [...new Set([image, ...images].filter(Boolean))];
  const inWishlist = isInWishlist(id);
  const isOutOfStock = stock <= 0;

  const whatsappNumber = (
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
  ).replace(/\D/g, '');

  const whatsappMessage = encodeURIComponent(
    `Bonjour, je souhaite commander ${name} au prix de ${price}.`
  );

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product);
    }
  };

  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-amber-500/40 bg-black text-white shadow-lg shadow-black/30 transition duration-300 hover:border-amber-400">
        {/* Image principale */}
        <div className="relative aspect-4/5 overflow-hidden bg-stone-900">
          {productImages.length > 0 ? (
            <Image
              src={productImages[0]}
              alt={name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-stone-400">
              Image non disponible
            </div>
          )}

          {/* Catégorie réelle */}
          {category && (
            <span className="absolute bottom-3 left-3 max-w-[75%] truncate rounded-full bg-black/75 px-3 py-1 text-xs text-amber-300 backdrop-blur">
              {category}
            </span>
          )}

          {/* Favoris */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            aria-label={
              inWishlist
                ? 'Retirer des favoris'
                : 'Ajouter aux favoris'
            }
            aria-pressed={inWishlist}
            className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400/60 bg-black/80 text-2xl text-amber-300 transition hover:bg-amber-400 hover:text-black"
          >
            {inWishlist ? '♥' : '♡'}
          </button>

          {/* Indicateur des photos supplémentaires */}
          {productImages.length > 1 && (
            <span className="absolute bottom-3 right-3 rounded-full bg-black/80 px-3 py-1 text-xs text-white">
              +{productImages.length - 1} photo(s)
            </span>
          )}
        </div>

        {/* Informations provenant du produit */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          <h3 className="mb-2 line-clamp-2 min-h-10 font-serif text-sm font-semibold tracking-wide text-amber-50 sm:text-base">
            {name}
          </h3>

          <p className="mb-3 text-lg font-bold text-amber-400 sm:text-xl">
            {price}
          </p>

          <p
            className={`mb-4 text-xs font-medium ${
              isOutOfStock ? 'text-red-400' : 'text-stone-300'
            }`}
          >
            {isOutOfStock
              ? 'Rupture de stock'
              : `Stock disponible : ${stock}`}
          </p>

          {/* Actions */}
          <div className="mt-auto grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveImage(0);
                setIsModalOpen(true);
              }}
              className="rounded-lg border border-amber-500/60 px-2 py-2 text-[10px] font-semibold uppercase text-amber-200 transition hover:bg-amber-500 hover:text-black sm:text-xs"
            >
              Aperçu
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="rounded-lg bg-amber-400 px-2 py-2 text-[10px] font-bold uppercase text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400 sm:text-xs"
            >
              {isOutOfStock ? 'Indisponible' : 'Ajouter'}
            </button>
          </div>
        </div>
      </article>

      {/* Fenêtre d'aperçu */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/90 p-3 sm:p-6"
          onClick={() => setIsModalOpen(false)}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label={`Aperçu de ${name}`}
            className="relative my-auto w-full max-w-4xl overflow-hidden rounded-2xl border border-amber-500/50 bg-stone-950"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              aria-label="Fermer l'aperçu"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-amber-400 bg-black text-xl text-amber-300"
            >
              ×
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Galerie */}
              <div>
                <div className="relative aspect-4/5 bg-stone-900">
                  {productImages.length > 0 ? (
                    <Image
                      src={productImages[activeImage] || productImages[0]}
                      alt={name}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-stone-400">
                      Image non disponible
                    </div>
                  )}
                </div>

                {productImages.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto p-3">
                    {productImages.map((src, index) => (
                      <button
                        key={`${src}-${index}`}
                        type="button"
                        onClick={() => setActiveImage(index)}
                        aria-label={`Afficher la photo ${index + 1}`}
                        aria-pressed={activeImage === index}
                        className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border ${
                          activeImage === index
                            ? 'border-amber-400'
                            : 'border-stone-700'
                        }`}
                      >
                        <Image
                          src={src}
                          alt={`${name} ${index + 1}`}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Détails */}
              <div className="flex flex-col p-5 sm:p-8">
                {category && (
                  <p className="mb-3 text-xs uppercase tracking-[0.2em] text-amber-400">
                    {category}
                  </p>
                )}

                <h2 className="mb-4 pr-8 font-serif text-2xl font-bold uppercase tracking-wide text-amber-50 sm:text-3xl">
                  {name}
                </h2>

                <p className="mb-5 text-2xl font-bold text-amber-400 sm:text-3xl">
                  {price}
                </p>

                {description && (
                  <p className="mb-5 whitespace-pre-line text-sm leading-7 text-stone-300">
                    {description}
                  </p>
                )}

                <p
                  className={`mb-6 text-sm ${
                    isOutOfStock ? 'text-red-400' : 'text-stone-300'
                  }`}
                >
                  {isOutOfStock
                    ? 'Rupture de stock'
                    : `Stock disponible : ${stock}`}
                </p>

                <div className="mt-auto space-y-3">
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                    className="w-full rounded-lg bg-amber-400 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:bg-stone-700 disabled:text-stone-400"
                  >
                    {isOutOfStock
                      ? 'Indisponible'
                      : 'Ajouter au panier'}
                  </button>

                  {whatsappNumber && (
                    <a
                      href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full rounded-lg border border-amber-400 px-4 py-3 text-center text-sm font-semibold text-amber-200 transition hover:bg-amber-400 hover:text-black"
                    >
                      Commander sur WhatsApp
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

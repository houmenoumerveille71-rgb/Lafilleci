'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type Props = {
  id: string;
  product: any;
};

const stars = [5, 4, 3, 2, 1];

const renderStars = (rating: number) => {
  return stars.map((s) => (
    <span
      key={s}
      className={`text-yellow-500 mr-1 ${s <= rating ? 'text-amber-500' : 'text-stone-600'}`}
    >
      ★
    </span>
  ));
};

export default function ClientProductPage({ id, product }: Props) {
  const productId = parseInt(id);

  const [reviews, setReviews] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [userTitle, setUserTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    getServerSession(authOptions).then((s) => setSession(s));
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${productId}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
        setAverageRating(data.averageRating || 0);
        setTotalReviews(data.totalReviews || 0);

        if (session?.user && data.reviews) {
          const existing = data.reviews.find((r: any) => r.userId === session.user.id);
          if (existing) {
            setUserRating(existing.rating);
            setUserReview(existing.comment || '');
            setUserTitle(existing.title || '');
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  };

  const selectRating = (rating: number) => {
    setUserRating(rating);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userRating) {
      setReviewError('Veuillez sélectionner une note');
      return;
    }
    setSubmitting(true);
    setReviewError('');
    setReviewSuccess('');

    try {
      const res = await fetch(`/api/reviews/${productId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating: userRating, title: userTitle, comment: userReview }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setReviewError(errorData.error || 'Erreur lors de la soumission');
      } else {
        setReviewSuccess('Merci pour votre avis !');
        setSubmitting(false);
        setUserRating(0);
        setUserReview('');
        setUserTitle('');
        fetchReviews();
      }
    } catch (error) {
      setReviewError('Une erreur est survenue');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <nav className="flex items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-400 transition">Accueil</Link>
          <span>/</span>
          <span className="text-amber-200">{product.category}</span>
          <span>/</span>
          <span className="text-amber-100">{product.name}</span>
        </nav>

        <div className="grid gap-12">
          <div className="sm:grid-cols-2 lg:grid-cols-3">
            <div className="relative aspect-w-3 aspect-h-4 bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-sm">
              {product.image ? (
                <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <span>[ Image {product.name} ]</span>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80 mb-2">
                {product.category}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif tracking-wider text-amber-100 uppercase mb-4">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-4">
                {renderStars(averageRating)}
                <span className="text-xs text-stone-400 font-mono">
                  {averageRating.toFixed(1)} ({totalReviews} avis)
                </span>
              </div>

              <p className="text-2xl font-mono text-amber-400 mb-8">
                {product.price}
              </p>

              <div className="space-y-4 mb-8">
                <p className="text-sm text-stone-400 leading-relaxed">
                  {product.description || 'Une pièce exceptionnelle qui allie élégance et raffinement.'}
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

        <section className="py-16 px-6 max-w-7xl mx-auto border-t border-amber-900/20">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-4 mb-12">
            <div>
              <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80 block">
                Avis Clients
              </span>
              <h2 className="text-3xl font-serif tracking-widest text-amber-100 uppercase">
                Ce que nos clients disent
              </h2>
            </div>
            {totalReviews > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400 font-mono">
                  Note moyenne : {averageRating.toFixed(1)} / 5
                </span>
                <div className="flex">
                  {renderStars(Math.round(averageRating))}
                </div>
              </div>
            )}
          </div>

          <div className="bg-stone-950 border border-amber-900/20 p-6 mb-12">
            <h3 className="text-xl font-serif tracking-widest text-amber-100 uppercase mb-4">
              {session ? 'Donner votre avis' : 'Connectez-vous pour donner votre avis'}
            </h3>

            {!session ? (
              <div className="text-center py-4">
                <p className="text-xs text-stone-400 mb-4">
                  Vous devez être connecté pour laisser un avis.
                </p>
                <Link href="/login" className="text-amber-400 hover:text-amber-300 transition text-xs uppercase tracking-widest">
                  Se connecter
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex items-start gap-4">
                  <label className="text-xs uppercase tracking-widest text-amber-200 mt-1">
                    Votre note
                  </label>
                  <div className="flex flex-col items-start gap-2">
                    {stars.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => selectRating(s)}
                        className={`text-yellow-500 hover:text-amber-400 transition ${s <= userRating ? 'text-amber-500 text-xl' : 'text-stone-600 text-base'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                    Titre de l'avis
                  </label>
                  <input
                    type="text"
                    value={userTitle}
                    onChange={(e) => setUserTitle(e.target.value)}
                    placeholder="Mon expérience avec ce produit"
                    className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                    Votre commentaire
                  </label>
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    rows={4}
                    placeholder="Partagez votre expérience..."
                    className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

                {reviewError && (
                  <div className="bg-red-950 border border-red-700 text-red-100 px-4 py-3 text-sm">
                    {reviewError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
                >
                  {submitting ? 'Envoi...' : 'Publier mon avis'}
                </button>
              </form>
            )}

            {reviewSuccess && (
              <div className="bg-green-950 border border-green-700 text-green-100 px-4 py-3 text-sm mt-4 text-center">
                {reviewSuccess}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((review: any) => (
                <div key={review.id} className="bg-stone-950 border border-amber-900/20 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-xs font-semibold text-amber-100 uppercase">
                        {review.user?.firstName?.[0]}{review.user?.lastName?.[0]}
                      </span>
                      <span className="text-xs text-stone-500 ml-2">{review.createdAt?.slice(0, 10)}</span>
                    </div>
                    <div className="flex">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                  {review.title && (
                    <h4 className="text-sm text-amber-100 mb-1">{review.title}</h4>
                  )}
                  {review.comment && (
                    <p className="text-sm text-stone-300">{review.comment}</p>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-stone-500 text-xs">
                Aucun avis pour le moment. Soyez le premier à donner votre avis !
              </div>
            )}
          </div>
        </section>

        <Footer />
      </section>
    </div>
  );
}

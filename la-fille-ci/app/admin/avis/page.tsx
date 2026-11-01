'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';

export default function AdminAvisPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    const res = await fetch('/api/admin/reviews');
    if (res.ok) setReviews(await res.json());
    setLoading(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Supprimer cet avis ?')) return;
    const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
    if (res.ok) fetchReviews();
  };

  if (loading) return <div className="p-8 text-stone-400">Chargement...</div>;

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">Modération des avis</h1>
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-stone-900 border border-amber-900/20 p-4 flex justify-between items-start">
            <div>
              <p className="text-amber-100 text-sm">{r.product?.name} — {r.user?.firstName} {r.user?.lastName}</p>
              <p className="text-xs text-stone-400 mt-1">{r.title}</p>
              <p className="text-xs text-stone-500 mt-1">{r.comment}</p>
              <p className="text-xs text-amber-400 mt-1">Note: {r.rating}/5</p>
            </div>
            <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 text-xs uppercase">
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

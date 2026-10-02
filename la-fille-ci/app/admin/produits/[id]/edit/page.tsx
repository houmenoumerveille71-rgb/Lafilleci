'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { Product } from '@/lib/products';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '0',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (res.ok) {
          const product = await res.json();
          setFormData({
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description || '',
            stock: product.stock?.toString() || '0',
          });
        }
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        router.push('/admin/produits');
      }
    } catch (error) {
      console.error('Failed to update product:', error);
    }
  };

  if (loading) {
    return <div className="text-center text-stone-400">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
        Modifier le Produit
      </h1>

      <div className="bg-stone-900 border border-amber-900/20 p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Nom
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Prix
              </label>
              <input
                type="text"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Catégorie
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              >
                <option value="">Sélectionner</option>
                <option value="Habits de Sortie">Habits de Sortie</option>
                <option value="Tenues de Sport">Tenues de Sport</option>
                <option value="Tenues en Crochet">Tenues en Crochet</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Stock
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const uploadFormData = new FormData();
                  uploadFormData.append('image', file);

                  const res = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData,
                  });

                  if (res.ok) {
                    const data = await res.json();
                    setFormData({ ...formData, image: data.imageUrl });
                  }
                }}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
              {formData.image && (
                <div className="mt-2">
                  <img src={formData.image} alt="Preview" className="w-32 h-32 object-cover border border-amber-900/40" />
                </div>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500 resize-none"
              />
            </div>
          </div>
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
            >
              Mettre à Jour
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin/produits')}
              className="bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-700 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
            >
              Annuler
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

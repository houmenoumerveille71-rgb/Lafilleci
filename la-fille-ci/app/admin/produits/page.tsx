'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/lib/products';

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: '0',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          stock: parseInt(formData.stock),
        }),
      });

      if (res.ok) {
        fetchProducts();
        resetForm();
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      description: product.description || '',
      stock: product.stock?.toString() || '0',
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchProducts();
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      category: '',
      image: '',
      description: '',
      stock: '0',
    });
    setEditingProduct(null);
    setIsCreating(false);
  };

  if (loading) {
    return <div className="text-center text-stone-400">Chargement...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase">
          Gestion des Produits
        </h1>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
        >
          Nouveau Produit
        </button>
      </div>

      {/* Form */}
      {isCreating && (
        <div className="bg-stone-900 border border-amber-900/20 p-6 mb-8">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            {editingProduct ? 'Modifier le Produit' : 'Créer un Produit'}
          </h2>
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
                {editingProduct ? 'Mettre à Jour' : 'Créer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-700 px-6 py-2 text-xs tracking-[0.25em] uppercase transition"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-stone-900 border border-amber-900/20 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-800 border-b border-amber-900/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Nom</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Catégorie</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Prix</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Stock</th>
              <th className="text-left px-6 py-3 text-xs uppercase tracking-widest text-amber-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {products.map((product: Product) => (
              <tr key={product.id} className="hover:bg-stone-800/50">
                <td className="px-6 py-4 text-amber-100">{product.name}</td>
                <td className="px-6 py-4 text-stone-400">{product.category}</td>
                <td className="px-6 py-4 text-amber-200">{product.price}</td>
                <td className="px-6 py-4">
                  <span className={`${product.stock === 0 ? 'text-red-400' : 'text-stone-300'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-amber-400 hover:text-amber-300 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-400 hover:text-red-300 text-xs"
                    >
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

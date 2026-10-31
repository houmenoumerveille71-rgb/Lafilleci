
'use client';

import { useEffect, useState } from 'react';
import type { Product } from '@/lib/products';

type ProductForm = {
  name: string;
  price: string;
  category: string;
  description: string;
  stock: string;
  files: File[];
  imageUrls: string[];
};

const emptyProduct = (): ProductForm => ({
  name: '',
  price: '',
  category: '',
  description: '',
  stock: '0',
  files: [],
  imageUrls: [],
});

const inputClass =
  'w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500';

export default function AdminProduitsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [rows, setRows] = useState<ProductForm[]>([emptyProduct()]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Impossible de charger les produits.');
      setProducts(await res.json());
    } catch (e) {
      console.error(e);
      setError('Impossible de charger les produits.');
    } finally {
      setLoading(false);
    }
  }

  function updateRow(index: number, changes: Partial<ProductForm>) {
    setRows((previous) =>
      previous.map((row, i) =>
        i === index ? { ...row, ...changes } : row
      )
    );
  }

  function addRow() {
    setRows((previous) => [...previous, emptyProduct()]);
  }

  function removeRow(index: number) {
    setRows((previous) =>
      previous.length === 1
        ? [emptyProduct()]
        : previous.filter((_, i) => i !== index)
    );
  }

  async function uploadImages(files: File[]): Promise<string[]> {
    if (files.length === 0) return [];

    const data = new FormData();
    files.forEach((file) => data.append('images', file));

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: data,
    });

    const result = await res.json();

    if (!res.ok) {
      throw new Error(result.error || 'Échec de l’envoi des images.');
    }

    return result.imageUrls ?? [result.imageUrl].filter(Boolean);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const validRows = rows.filter(
        (row) =>
          row.name.trim() &&
          row.price.trim() &&
          row.category.trim()
      );

      if (validRows.length === 0) {
        throw new Error('Remplis au moins un produit : nom, prix et catégorie.');
      }

      // Téléverse les images et prépare chaque produit.
      const prepared = [];

      for (const row of validRows) {
        const uploadedUrls = await uploadImages(row.files);
        const allImages = [
          ...row.imageUrls,
          ...uploadedUrls,
        ];

        prepared.push({
          name: row.name.trim(),
          price: row.price.trim(),
          category: row.category,
          description: row.description.trim(),
          stock: Number(row.stock || 0),
          image: allImages[0] || '',
          images: allImages,
        });
      }

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products: prepared }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Échec de l’enregistrement.');
      }

      setMessage(`${result.created} produit(s) ajouté(s) avec succès.`);
      setRows([emptyProduct()]);
      await fetchProducts();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Une erreur est survenue.'
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleEditSubmit(
    e: React.FormEvent<HTMLFormElement>,
    product: Product
  ) {
    e.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const files = formData.getAll('images').filter(
        (item): item is File => item instanceof File && item.size > 0
      );

      const uploaded = await uploadImages(files);
      const oldImages = product.images?.length
        ? product.images
        : product.image
          ? [product.image]
          : [];

      const images = [...oldImages, ...uploaded];

      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: String(formData.get('name') || ''),
          price: String(formData.get('price') || ''),
          category: String(formData.get('category') || ''),
          description: String(formData.get('description') || ''),
          stock: Number(formData.get('stock') || 0),
          image: images[0] || '',
          images,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Échec de la modification.');

      setEditingProduct(null);
      setMessage('Produit modifié avec succès.');
      await fetchProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de modification.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Suppression impossible.');
      await fetchProducts();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur de suppression.');
    }
  }

  if (loading) {
    return <div className="text-center text-stone-400">Chargement...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase">
          Gestion des Produits
        </h1>
      </div>

      {message && (
        <div className="border border-green-700 bg-green-950 p-4 text-sm text-green-100">
          {message}
        </div>
      )}

      {error && (
        <div className="border border-red-700 bg-red-950 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {/* Ajout groupé */}
      <section className="bg-stone-900 border border-amber-900/20 p-6">
        <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-2">
          Ajouter plusieurs produits
        </h2>
        <p className="text-xs text-stone-400 mb-6">
          Remplis les informations de chaque article et sélectionne plusieurs images si nécessaire.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {rows.map((row, index) => (
            <div
              key={index}
              className="border border-amber-900/30 p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-amber-200 text-sm uppercase">
                  Produit {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="text-red-400 text-xs hover:text-red-300"
                >
                  Retirer
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="text-xs text-amber-200">
                  Nom du produit
                  <input
                    className={inputClass}
                    value={row.name}
                    onChange={(e) => updateRow(index, { name: e.target.value })}
                    placeholder="Nom du produit"
                  />
                </label>

                <label className="text-xs text-amber-200">
                  Prix
                  <input
                    className={inputClass}
                    value={row.price}
                    onChange={(e) => updateRow(index, { price: e.target.value })}
                    placeholder="Ex. 5000 FCFA"
                  />
                </label>

                <label className="text-xs text-amber-200">
                  Catégorie
                  <select
                    className={inputClass}
                    value={row.category}
                    onChange={(e) => updateRow(index, { category: e.target.value })}
                  >
                    <option value="">Sélectionner</option>
                    <option value="Habits de Sortie">Habits de Sortie</option>
                    <option value="Tenues de Sport">Tenues de Sport</option>
                    <option value="Tenues en Crochet">Tenues en Crochet</option>
                  </select>
                </label>

                <label className="text-xs text-amber-200">
                  Stock
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={row.stock}
                    onChange={(e) => updateRow(index, { stock: e.target.value })}
                  />
                </label>

                <label className="md:col-span-2 text-xs text-amber-200">
                  Images du produit
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className={inputClass}
                    onChange={(e) =>
                      updateRow(index, {
                        files: Array.from(e.target.files ?? []),
                      })
                    }
                  />
                  <span className="block mt-2 text-stone-400">
                    {row.files.length} image(s) sélectionnée(s)
                  </span>
                  {row.files.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {row.files.map((file, fileIndex) => (
                        <div key={`${file.name}-${fileIndex}`} className="w-20">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="w-20 h-20 object-cover border border-amber-900/40"
                          />
                          <p className="text-[10px] text-stone-400 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </label>

                <label className="md:col-span-2 text-xs text-amber-200">
                  Description
                  <textarea
                    rows={3}
                    className={inputClass}
                    value={row.description}
                    onChange={(e) => updateRow(index, { description: e.target.value })}
                  />
                </label>
              </div>
            </div>
          ))}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addRow}
              className="border border-amber-600/40 px-5 py-3 text-xs uppercase tracking-widest text-amber-100 hover:bg-stone-800"
            >
              + Ajouter une ligne
            </button>

            <button
              type="submit"
              disabled={saving}
              className="bg-amber-800/80 hover:bg-amber-700 disabled:opacity-50 border border-amber-600/40 px-6 py-3 text-xs uppercase tracking-widest text-amber-100"
            >
              {saving ? 'Enregistrement...' : 'Enregistrer les produits'}
            </button>
          </div>
        </form>
      </section>

      {/* Modification d'un produit existant */}
      {editingProduct && (
        <section className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg text-amber-100 uppercase mb-4">
            Modifier : {editingProduct.name}
          </h2>

          <form
            key={editingProduct.id}
            onSubmit={(e) => handleEditSubmit(e, editingProduct)}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <label className="text-xs text-amber-200">
              Nom
              <input name="name" defaultValue={editingProduct.name} required className={inputClass} />
            </label>

            <label className="text-xs text-amber-200">
              Prix
              <input name="price" defaultValue={editingProduct.price} required className={inputClass} />
            </label>

            <label className="text-xs text-amber-200">
              Catégorie
              <select name="category" defaultValue={editingProduct.category} required className={inputClass}>
                <option value="Habits de Sortie">Habits de Sortie</option>
                <option value="Tenues de Sport">Tenues de Sport</option>
                <option value="Tenues en Crochet">Tenues en Crochet</option>
              </select>
            </label>

            <label className="text-xs text-amber-200">
              Stock
              <input name="stock" type="number" min="0" defaultValue={editingProduct.stock ?? 0} className={inputClass} />
            </label>

            <label className="md:col-span-2 text-xs text-amber-200">
              Ajouter des images
              <input name="images" type="file" accept="image/*" multiple className={inputClass} />
              <span className="block mt-2 text-stone-400 text-xs">
                Les images sélectionnées seront ajoutées aux images existantes.
              </span>
            </label>

            <label className="md:col-span-2 text-xs text-amber-200">
              Description
              <textarea name="description" rows={3} defaultValue={editingProduct.description ?? ''} className={inputClass} />
            </label>

            <div className="md:col-span-2 flex gap-3">
              <button disabled={saving} className="bg-amber-800 px-5 py-2 text-xs uppercase text-amber-100">
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button type="button" onClick={() => setEditingProduct(null)} className="border border-stone-700 px-5 py-2 text-xs text-stone-200">
                Annuler
              </button>
            </div>
          </form>
        </section>
      )}

      {/* Liste des produits */}
      <section className="bg-stone-900 border border-amber-900/20 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-800 border-b border-amber-900/20">
            <tr>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Nom</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Catégorie</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Prix</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Stock</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Images</th>
              <th className="text-left px-6 py-3 text-xs uppercase text-amber-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-stone-800/50">
                <td className="px-6 py-4 text-amber-100">{product.name}</td>
                <td className="px-6 py-4 text-stone-400">{product.category}</td>
                <td className="px-6 py-4 text-amber-200">{product.price}</td>
                <td className="px-6 py-4 text-stone-300">{product.stock ?? 0}</td>
                <td className="px-6 py-4 text-stone-300">
                  {product.images?.length || (product.image ? 1 : 0)}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setError('');
                        setMessage('');
                        setEditingProduct(product);
                      }}
                      className="text-amber-400 hover:text-amber-300 text-xs"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => void handleDelete(product.id)}
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
      </section>
    </div>
  );
}

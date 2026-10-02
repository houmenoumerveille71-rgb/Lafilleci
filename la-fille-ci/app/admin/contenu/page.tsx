'use client';

import { useState, useEffect } from 'react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  active: boolean;
}

interface CategoryBanner {
  id: number;
  title: string;
  slug: string;
  image: string;
  active: boolean;
}

interface InstagramPost {
  id: number;
  image: string;
  alt: string | null;
  active: boolean;
}

export default function AdminContenuPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categoryBanners, setCategoryBanners] = useState<CategoryBanner[]>([]);
  const [instagramPosts, setInstagramPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);

  const [bannerForm, setBannerForm] = useState({ title: '', subtitle: '', image: '', active: true });
  const [categoryBannerForm, setCategoryBannerForm] = useState({ title: '', slug: '', image: '', active: true });
  const [instagramForm, setInstagramForm] = useState({ image: '', alt: '', active: true });

  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editingCategoryBanner, setEditingCategoryBanner] = useState<CategoryBanner | null>(null);
  const [editingInstagram, setEditingInstagram] = useState<InstagramPost | null>(null);

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      const [bannersRes, categoryBannersRes, instagramRes] = await Promise.all([
        fetch('/api/banners'),
        fetch('/api/category-banners'),
        fetch('/api/instagram'),
      ]);

      if (bannersRes.ok) setBanners(await bannersRes.json());
      if (categoryBannersRes.ok) setCategoryBanners(await categoryBannersRes.json());
      if (instagramRes.ok) setInstagramPosts(await instagramRes.json());
    } catch (error) {
      console.error('Failed to fetch content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      return data.imageUrl;
    }
    throw new Error('Failed to upload image');
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBanner ? `/api/banners/${editingBanner.id}` : '/api/banners';
      const method = editingBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bannerForm),
      });

      if (res.ok) {
        fetchAllContent();
        setBannerForm({ title: '', subtitle: '', image: '', active: true });
        setEditingBanner(null);
      }
    } catch (error) {
      console.error('Failed to save banner:', error);
    }
  };

  const handleCategoryBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingCategoryBanner ? `/api/category-banners/${editingCategoryBanner.id}` : '/api/category-banners';
      const method = editingCategoryBanner ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryBannerForm),
      });

      if (res.ok) {
        fetchAllContent();
        setCategoryBannerForm({ title: '', slug: '', image: '', active: true });
        setEditingCategoryBanner(null);
      }
    } catch (error) {
      console.error('Failed to save category banner:', error);
    }
  };

  const handleInstagramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingInstagram ? `/api/instagram/${editingInstagram.id}` : '/api/instagram';
      const method = editingInstagram ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(instagramForm),
      });

      if (res.ok) {
        fetchAllContent();
        setInstagramForm({ image: '', alt: '', active: true });
        setEditingInstagram(null);
      }
    } catch (error) {
      console.error('Failed to save instagram post:', error);
    }
  };

  const handleDelete = async (type: 'banner' | 'categoryBanner' | 'instagram', id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ?')) return;

    const endpoints = {
      banner: `/api/banners/${id}`,
      categoryBanner: `/api/category-banners/${id}`,
      instagram: `/api/instagram/${id}`,
    };

    const res = await fetch(endpoints[type], { method: 'DELETE' });
    if (res.ok) {
      fetchAllContent();
    }
  };

  if (loading) {
    return <div className="text-center text-stone-400">Chargement...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8">
        Gestion du Contenu
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Banners Management */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Bannières Hero
          </h2>

          <form onSubmit={handleBannerSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Titre</label>
              <input
                type="text"
                value={bannerForm.title}
                onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Sous-titre</label>
              <input
                type="text"
                value={bannerForm.subtitle}
                onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const imageUrl = await handleImageUpload(file);
                  setBannerForm({ ...bannerForm, image: imageUrl });
                }}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            {bannerForm.image && (
              <img src={bannerForm.image} alt="Preview" className="w-full h-32 object-cover border border-amber-900/40" />
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                {editingBanner ? 'Mettre à Jour' : 'Créer'}
              </button>
              {editingBanner && (
                <button type="button" onClick={() => { setEditingBanner(null); setBannerForm({ title: '', subtitle: '', image: '', active: true }); }} className="bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-700 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {banners.map((banner: any) => (
              <div key={banner.id} className="border border-stone-800 p-3">
                <img src={banner.image} alt={banner.title} className="w-full h-24 object-cover mb-2" />
                <p className="text-amber-100 text-sm">{banner.title}</p>
                <p className="text-xs text-stone-400">{banner.subtitle}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setEditingBanner(banner); setBannerForm({ title: banner.title, subtitle: banner.subtitle, image: banner.image, active: banner.active }); }} className="text-xs text-amber-400 hover:text-amber-300">Modifier</button>
                  <button onClick={() => handleDelete('banner', banner.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Banners Management */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Bannières Catégories
          </h2>

          <form onSubmit={handleCategoryBannerSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Titre</label>
              <input
                type="text"
                value={categoryBannerForm.title}
                onChange={(e) => setCategoryBannerForm({ ...categoryBannerForm, title: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Slug</label>
              <input
                type="text"
                value={categoryBannerForm.slug}
                onChange={(e) => setCategoryBannerForm({ ...categoryBannerForm, slug: e.target.value })}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const imageUrl = await handleImageUpload(file);
                  setCategoryBannerForm({ ...categoryBannerForm, image: imageUrl });
                }}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            {categoryBannerForm.image && (
              <img src={categoryBannerForm.image} alt="Preview" className="w-full h-32 object-cover border border-amber-900/40" />
            )}
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                {editingCategoryBanner ? 'Mettre à Jour' : 'Créer'}
              </button>
              {editingCategoryBanner && (
                <button type="button" onClick={() => { setEditingCategoryBanner(null); setCategoryBannerForm({ title: '', slug: '', image: '', active: true }); }} className="bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-700 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="space-y-3">
            {categoryBanners.map((banner: any) => (
              <div key={banner.id} className="border border-stone-800 p-3">
                <img src={banner.image} alt={banner.title} className="w-full h-24 object-cover mb-2" />
                <p className="text-amber-100 text-sm">{banner.title}</p>
                <p className="text-xs text-stone-400">{banner.slug}</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => { setEditingCategoryBanner(banner); setCategoryBannerForm({ title: banner.title, slug: banner.slug, image: banner.image, active: banner.active }); }} className="text-xs text-amber-400 hover:text-amber-300">Modifier</button>
                  <button onClick={() => handleDelete('categoryBanner', banner.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Instagram Feed Management */}
        <div className="bg-stone-900 border border-amber-900/20 p-6">
          <h2 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">
            Feed Instagram
          </h2>

          <form onSubmit={handleInstagramSubmit} className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const imageUrl = await handleImageUpload(file);
                  setInstagramForm({ ...instagramForm, image: imageUrl });
                }}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            {instagramForm.image && (
              <img src={instagramForm.image} alt="Preview" className="w-full h-32 object-cover border border-amber-900/40" />
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">Texte alternatif</label>
              <input
                type="text"
                value={instagramForm.alt}
                onChange={(e) => setInstagramForm({ ...instagramForm, alt: e.target.value })}
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div className="flex gap-2">
              <button type="submit" className="flex-1 bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                {editingInstagram ? 'Mettre à Jour' : 'Ajouter'}
              </button>
              {editingInstagram && (
                <button type="button" onClick={() => { setEditingInstagram(null); setInstagramForm({ image: '', alt: '', active: true }); }} className="bg-transparent hover:bg-stone-800 text-stone-300 border border-stone-700 px-4 py-2 text-xs tracking-[0.25em] uppercase transition">
                  Annuler
                </button>
              )}
            </div>
          </form>

          <div className="grid grid-cols-2 gap-3">
            {instagramPosts.map((post: any) => (
              <div key={post.id} className="border border-stone-800 p-2">
                <img src={post.image} alt={post.alt || ''} className="w-full h-24 object-cover mb-2" />
                <div className="flex gap-2">
                  <button onClick={() => { setEditingInstagram(post); setInstagramForm({ image: post.image, alt: post.alt || '', active: post.active }); }} className="text-xs text-amber-400 hover:text-amber-300">Modifier</button>
                  <button onClick={() => handleDelete('instagram', post.id)} className="text-xs text-red-400 hover:text-red-300">Supprimer</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';

export default function ProfileForm({ firstName, lastName, phone, image }: { firstName: string; lastName: string; phone: string; image: string }) {
  const [fn, setFn] = useState(firstName);
  const [ln, setLn] = useState(lastName);
  const [ph, setPh] = useState(phone);
  const [img, setImg] = useState(image);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const data = await res.json();
      setImg(data.imageUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName: fn, lastName: ln, phone: ph, image: img }),
      });
      const data = await res.json();
      setMessage(res.ok ? 'Profil mis à jour' : data.error || 'Erreur');
    } catch {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stone-950 border border-amber-900/20 p-6 mt-8 space-y-4">
      <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">Modifier le profil</h3>
      {img && <img src={img} alt="Profil" className="w-20 h-20 object-cover border border-amber-900/40" />}
      <input type="file" accept="image/*" onChange={handleFile} className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200" />
      <input value={fn} onChange={(e) => setFn(e.target.value)} placeholder="Prénom" className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200" />
      <input value={ln} onChange={(e) => setLn(e.target.value)} placeholder="Nom" className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200" />
      <input value={ph} onChange={(e) => setPh(e.target.value)} placeholder="Téléphone" className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200" />
      <button type="submit" disabled={loading} className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition disabled:opacity-50">
        {loading ? 'Mise à jour...' : 'Enregistrer'}
      </button>
      {message && <p className="text-xs text-stone-300">{message}</p>}
    </form>
  );
}

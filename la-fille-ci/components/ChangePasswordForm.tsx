'use client';

import { useState } from 'react';

export default function ChangePasswordForm() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/account/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: current, newPassword: next }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage('Mot de passe modifié avec succès');
        setCurrent('');
        setNext('');
      } else {
        setMessage(data.error || 'Erreur');
      }
    } catch {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-stone-950 border border-amber-900/20 p-6 mt-8 space-y-4">
      <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-4">Modifier le mot de passe</h3>
      <input
        type="password"
        placeholder="Mot de passe actuel"
        value={current}
        onChange={(e) => setCurrent(e.target.value)}
        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200"
        required
      />
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={next}
        onChange={(e) => setNext(e.target.value)}
        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-2 text-stone-200"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-6 py-2 text-xs tracking-[0.25em] uppercase transition disabled:opacity-50"
      >
        {loading ? 'Modification...' : 'Modifier'}
      </button>
      {message && <p className="text-xs text-stone-300">{message}</p>}
    </form>
  );
}

'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';

export default function DeleteAccountButton() {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Voulez-vous vraiment supprimer votre compte ?')) return;
    setLoading(true);
    try {
      const res = await fetch('/api/account/delete', { method: 'DELETE' });
      if (res.ok) {
        await signOut({ callbackUrl: '/' });
      } else {
        alert('Erreur lors de la suppression');
      }
    } catch {
      alert('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-red-900/60 hover:bg-red-800 text-red-100 border border-red-700/50 px-6 py-3 text-xs tracking-[0.25em] uppercase transition disabled:opacity-50"
    >
      {loading ? 'Suppression...' : 'Supprimer mon compte'}
    </button>
  );
}

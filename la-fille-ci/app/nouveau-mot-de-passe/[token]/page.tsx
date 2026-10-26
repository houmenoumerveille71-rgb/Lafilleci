'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [validToken, setValidToken] = useState(false);

  useEffect(() => {
    if (token) {
      // Valider le token en appelant l'API
      fetch('/api/auth/verify-reset-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.valid) {
            setValidToken(true);
          } else {
            setError(data.error || 'Lien de réinitialisation invalide ou expiré');
          }
        })
        .catch(() => {
          setError('Une erreur est survenue');
        });
    } else {
      setError('Aucun token de réinitialisation fourni');
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
      } else {
        setSuccess('Votre mot de passe a été réinitialisé avec succès');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (!validToken && token) {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
        
        <Header />

        <section className="py-16 px-6 max-w-md mx-auto">
          <div className="text-center mb-12">
            <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
              Réinitialisation
            </span>
            <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
              Mot de passe oublié
            </h2>
          </div>

          <div className="bg-stone-950 border border-amber-900/20 p-8 text-center">
            {error && (
              <div className="bg-red-950 border border-red-700 text-red-100 px-4 py-3 text-sm mb-6">
                {error}
              </div>
            )}
            <p className="text-xs text-stone-400">
              Vérification du lien en cours...
            </p>
          </div>
        </section>

        <Footer />

      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-md mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Nouveau mot de passe
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Réinitialiser votre mot de passe
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8">
          {success && (
            <div className="bg-green-950 border border-green-700 text-green-100 px-4 py-3 text-sm mb-6">
              {success}
            </div>
          )}
          {!success && error && (
            <div className="bg-red-950 border border-red-700 text-red-100 px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          {!success && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Confirmer le nouveau mot de passe
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
              >
                {loading ? 'Mise à jour...' : 'Réinitialiser le mot de passe'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center">
            <p className="text-xs text-stone-400">
              Vous vous souvenez de votre mot de passe ?{' '}
              <Link href="/login" className="text-amber-400 hover:text-amber-300 transition">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

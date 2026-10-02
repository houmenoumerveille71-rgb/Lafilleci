'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      router.push('/admin/dashboard');
    }
  }, [status, session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('Email ou mot de passe incorrect');
      } else {
        const res = await fetch('/api/admin/check');
        const data = await res.json();
        
        if (data.isAdmin) {
          router.push('/admin/dashboard');
          router.refresh();
        } else {
          await signIn('credentials', { email: 'logout', password: 'logout', redirect: false });
          setError('Accès refusé : vous n\'êtes pas administrateur');
        }
      }
    } catch {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-400 text-sm">Vérification...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Administration
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Connexion Admin
          </h2>
        </div>

        <div className="bg-stone-950 border border-amber-900/20 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-950 border border-red-700 text-red-100 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Email Admin
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                placeholder="admin@lafille-ci.com"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
            >
              {loading ? 'Connexion...' : 'Se Connecter'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

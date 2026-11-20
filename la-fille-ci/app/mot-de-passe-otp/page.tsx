'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function OtpResetPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const requestOtp = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Erreur');
    } catch {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, otp, newPassword: password }),
      });
      const data = await res.json();
      setMessage(data.message || data.error || 'Erreur');
    } catch {
      setMessage('Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      <Header />
      <section className="py-16 px-6 max-w-md mx-auto">
        <h1 className="text-3xl font-serif tracking-widest text-amber-100 uppercase mb-8 text-center">Réinitialisation par SMS</h1>
        <div className="bg-stone-950 border border-amber-900/20 p-8 space-y-4">
          <input type="tel" placeholder="Numéro de téléphone" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200" />
          <button onClick={requestOtp} disabled={loading} className="w-full bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition disabled:opacity-50">
            {loading ? 'Envoi...' : 'Envoyer le code'}
          </button>
          <form onSubmit={verifyOtp} className="space-y-4">
            <input type="text" placeholder="Code OTP (6 chiffres)" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200" />
            <input type="password" placeholder="Nouveau mot de passe" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200" />
            <button type="submit" disabled={loading} className="w-full bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition disabled:opacity-50">
              {loading ? 'Vérification...' : 'Réinitialiser'}
            </button>
          </form>
          {message && <p className="text-xs text-stone-300 text-center">{message}</p>}
          <div className="text-center">
            <Link href="/login" className="text-amber-400 hover:text-amber-300 text-xs">Retour à la connexion</Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

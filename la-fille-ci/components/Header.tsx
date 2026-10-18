'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSession, signOut } from 'next-auth/react';

export default function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Barre Supérieure */}
      <div className="bg-stone-950 text-amber-200/70 text-[10px] tracking-[0.25em] uppercase py-2 text-center border-b border-amber-900/20">
        Atelier de Luxe Premium
      </div>

      {/* En-tête Principal */}
      <header className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

          {/* Logo */}
          <div className="flex-1 text-center md:text-left">
            <Link href="/" className="inline-block">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-serif tracking-wider text-amber-100 font-normal">
                Lafille–ci
              </h1>
              <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-amber-400/60 -mt-0.5">
                ATELIER DE LUXE PREMIUM
              </p>
            </Link>
          </div>

          {/* Icônes d'Action + Menu Mobile */}
          <div className="flex items-center gap-2 text-amber-100/80">
            {/* Bouton hamburger mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden hover:text-amber-400 transition"
              aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>

            {status === 'authenticated' ? (
              <>
                <Link href="/compte" className="hover:text-amber-400 transition flex items-center gap-1" aria-label="Compte">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="hidden sm:inline text-xs font-mono">{session?.user?.firstName?.[0]?.toUpperCase()}{session?.user?.lastName?.[0]?.toUpperCase()}</span>
                </Link>
                <button onClick={() => signOut()} className="hover:text-amber-400 transition flex items-center gap-1" aria-label="Déconnexion">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                  </svg>
                  <span className="hidden sm:inline text-xs font-mono">Déconnexion</span>
                </button>
                <Link href="/panier" className="hover:text-amber-400 transition flex items-center gap-1 relative" aria-label="Panier">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375 0 1 1-.75 0 .375 0 0 1 .75 0Zm7.5 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="text-xs font-mono">{totalItems}</span>
                </Link>
              </>
            ) : (
              <Link href="/login" className="hover:text-amber-400 transition flex items-center gap-1" aria-label="Connexion">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="text-xs font-mono">Connexion</span>
              </Link>
            )}
          </div>
        </div>

        {/* Barre de Navigation - Desktop */}
        <nav className="hidden md:flex justify-center space-x-8 py-3 border-t border-amber-900/10 text-[11px] tracking-[0.2em] uppercase text-stone-300">
          <Link href="/" className="hover:text-amber-300 transition">Nouveautés</Link>
          <Link href="/sortie" className="hover:text-amber-300 transition">Sortie</Link>
          <Link href="/sport" className="hover:text-amber-300 transition">Sport</Link>
          <Link href="/crochet" className="hover:text-amber-300 transition">Crochet</Link>
          <Link href="/journal" className="hover:text-amber-300 transition">Journal</Link>
          <Link href="/a-propos" className="hover:text-amber-300 transition">À Propos</Link>
          <Link href="/vente" className="hover:text-amber-300 transition">Vente</Link>
        </nav>

        {/* Barre de Navigation - Mobile */}
        <nav className={`md:hidden border-t border-amber-900/10 absolute w-full bg-black/98 backdrop-blur-sm transition-all duration-300 ${menuOpen ? 'block opacity-100 visible py-4' : 'hidden opacity-0 invisible py-0'}`}>
          <div className="flex flex-col space-y-3 text-center px-6">
            <Link href="/" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Nouveautés</Link>
            <Link href="/sortie" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Sortie</Link>
            <Link href="/sport" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Sport</Link>
            <Link href="/crochet" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Crochet</Link>
            <Link href="/journal" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Journal</Link>
            <Link href="/a-propos" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">À Propos</Link>
            <Link href="/vente" onClick={() => setMenuOpen(false)} className="block py-2 hover:text-amber-300 transition text-xs uppercase tracking-[0.2em]">Vente</Link>
          </div>
        </nav>
      </header>
    </>
  );
}

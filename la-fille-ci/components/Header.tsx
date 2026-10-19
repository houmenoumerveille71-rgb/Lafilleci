'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useSession, signOut } from 'next-auth/react';

const NAV_LINKS = [
  { href: '/', label: 'Accueil' },
  { href: '/nouveautes', label: 'Nouveautés' },
  { href: '/sortie', label: 'Sortie' },
  { href: '/sport', label: 'Sport' },
  { href: '/crochet', label: 'Crochet' },
  { href: '/journal', label: 'Journal' },
  { href: '/a-propos', label: 'À Propos' },
  { href: '/vente', label: 'Vente' },
];

export default function Header() {
  const { totalItems } = useCart();
  const { totalItems: wishlistCount } = useWishlist();
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const isAuthenticated = status === 'authenticated';

  // Ferme le menu a chaque changement de page
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Ferme le menu avec la touche Echap ou au clic a l'exterieur du tiroir
  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    const handlePointerDown = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [menuOpen]);

  // Bloque le defilement de la page quand le tiroir est ouvert
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const iconButton =
    'inline-flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center hover:text-amber-400 transition shrink-0';

  return (
    <>
      {/* En-tete Principal */}
      <header className="sticky top-0 z-50 w-full overflow-x-clip bg-black/95 backdrop-blur-sm border-b border-amber-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo */}
          <div className="flex-shrink-0 min-w-0 py-3 sm:py-4">
            <Link href="/" className="inline-block">
              <img src="/uploads/8fcd247c-bfa2-4eed-9773-43c4d0f2eff3.jpg" alt="La fille-ci" className="h-8 sm:h-10 md:h-12 lg:h-14 object-contain" />
            </Link>
          </div>

          {/* Navigation principale - visible a partir de 1280px (en dessous le menu deborde) */}
          <nav className="hidden xl:flex flex-1 justify-center gap-x-6 2xl:gap-x-8 py-2">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href + link.label}
                href={link.href}
                className="hover:text-amber-300 transition text-[11px] tracking-[0.2em] uppercase text-stone-300 whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Icones d'action */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            {/* Recherche */}
            <button className={iconButton} aria-label="Rechercher">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10.5 10.5a6 6 0 100-12 6 6 0 000 12z" />
              </svg>
            </button>

            {/* Favoris - desktop */}
            <Link href="/wishlist" className={`${iconButton} hidden lg:inline-flex relative`} aria-label="Liste d'envies">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.575-4.688-4.575-1.39 0-2.64.675-3.312 1.722-.672-1.047-1.922-1.722-3.312-1.722C7.099 3.675 5 5.765 5 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-amber-50 text-[10px]">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Panier */}
            <Link href="/panier" className={`${iconButton} relative`} aria-label="Panier">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375 0 1 1-.75 0 .375 0 0 1 .75 0Zm7.5 0a.375 0 1 1-.75 0 .375 0 0 1 .75 0Z" />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-amber-50 text-[10px]">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Compte - icone seule sur mobile/tablette, detail sur desktop */}
            {isAuthenticated ? (
              <>
                <Link href="/compte" className={`${iconButton} lg:hidden`} aria-label="Mon compte">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </Link>
                <div className="hidden lg:flex items-center gap-1">
                  <Link href="/compte" className="hover:text-amber-400 transition flex items-center gap-1 px-1" aria-label="Compte">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span className="text-xs font-mono">{session?.user?.firstName?.[0]?.toUpperCase()}{session?.user?.lastName?.[0]?.toUpperCase()}</span>
                  </Link>
                  <button onClick={() => signOut()} className="hover:text-amber-400 transition flex items-center gap-1 px-1" aria-label="Deconnexion">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    <span className="text-xs font-mono">Deconnexion</span>
                  </button>
                </div>
              </>
            ) : (
              <Link href="/login" className={`${iconButton} lg:hidden`} aria-label="Connexion">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </Link>
            )}

            {/* Connexion - desktop */}
            {!isAuthenticated && (
              <Link href="/login" className="hidden lg:inline-flex items-center gap-1 hover:text-amber-400 transition px-1" aria-label="Connexion">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <span className="text-xs font-mono">Connexion</span>
              </Link>
            )}

            {/* Menu hamburger - mobile et tablette */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`${iconButton} xl:hidden`}
              aria-label="Ouvrir le menu"
              aria-expanded={menuOpen}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Tiroir de navigation mobile */}
      {menuOpen && (
        <div className="xl:hidden fixed inset-0 z-[60] flex justify-end">
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />

          <div
            ref={drawerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
            className="relative h-full w-[85%] max-w-sm bg-black border-l border-amber-900/30 overflow-y-auto overscroll-contain"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-amber-900/20">
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-400/80">Menu</span>
              <button
                onClick={() => setMenuOpen(false)}
                className="inline-flex h-10 w-10 items-center justify-center text-amber-100/80 hover:text-amber-400 transition"
                aria-label="Fermer le menu"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-3 py-3">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href + link.label}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 text-xs uppercase tracking-[0.2em] text-stone-300 hover:text-amber-300 transition border-b border-amber-900/10"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-3 text-xs uppercase tracking-[0.2em] text-stone-300 hover:text-amber-300 transition border-b border-amber-900/10"
              >
                Liste d&apos;Envies
              </Link>
            </nav>

            <div className="px-3 pb-8 pt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/compte"
                    onClick={() => setMenuOpen(false)}
                    className="block px-3 py-3 text-xs uppercase tracking-[0.2em] text-amber-200 hover:text-amber-300 transition"
                  >
                    Mon Compte
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      signOut();
                    }}
                    className="block w-full text-left px-3 py-3 text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-amber-300 transition"
                  >
                    Deconnexion
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block px-3 py-3 text-xs uppercase tracking-[0.2em] text-amber-200 hover:text-amber-300 transition"
                >
                  Connexion
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

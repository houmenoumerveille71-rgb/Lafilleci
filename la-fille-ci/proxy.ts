import { withAuth } from 'next-auth/middleware';

/**
 * Protection des pages d'administration.
 *
 * Next.js 16 a renomme la convention `middleware` en `proxy` (meme
 * fonctionnement, le fichier `middleware.ts` est desoread deprecie) : ce fichier
 * assure donc le role d'un middleware.
 *
 * Ce proxy ne fait qu'une verification de presence de session (JWT NextAuth) :
 * il bloque l'acces aux visiteurs non connectes avant meme que la page ne soit
 * rendue. Le controle du role `isAdmin` reste fait en base par
 * `lib/require-admin.ts` (cote API) et par `app/admin/layout.tsx` (cote pages),
 * car le proxy s'execute en runtime Edge et ne doit pas interroger MySQL.
 */
export default withAuth({
  pages: {
    // Page de connexion dediee a l'administration.
    // Elle est volontairement HORS de /admin : sinon ce proxy (et le layout
    // app/admin/layout.tsx) s'appliqueraient a elle et la redirigeraient
    // vers elle-meme, provoquant une boucle de redirection.
    signIn: '/connexion-admin',
  },
});

export const config = {
  // Liste explicite des pages protegees. Eviter `/admin/((?!login).*)` :
  // ce motif ne fonctionne pas ici et provoque des boucles de redirection.
  matcher: [
    '/admin/dashboard',
    '/admin/produits/:path*',
    '/admin/commandes/:path*',
    '/admin/clients',
    '/admin/contenu',
    '/admin/newsletter',
  ],
};
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default async function ComptePage() {
  const session = (await getServerSession(authOptions as any)) as {
    user?: { id?: string | number; firstName?: string | null; lastName?: string | null; email?: string | null };
  } | null;

  if (!session) {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
        <Header />
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mb-4">
            Accès restreint
          </h2>
          <p className="text-stone-400 mb-8">Vous devez être connecté pour accéder à cette page.</p>
          <Link 
            href="/login"
            className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
          >
            Se Connecter
          </Link>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Bienvenue
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Mon Compte
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-stone-950 border border-amber-900/20 p-8 mb-8">
            <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-6">
              Informations Personnelles
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Prénom
                </label>
                <p className="text-sm text-stone-300">{session.user?.firstName || '-'}</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Nom
                </label>
                <p className="text-sm text-stone-300">{session.user?.lastName || '-'}</p>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-amber-200 mb-2">
                  Email
                </label>
                <p className="text-sm text-stone-300">{session.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/commandes" className="bg-stone-950 border border-amber-900/20 p-6 hover:border-amber-500 transition group">
              <h4 className="text-sm font-serif tracking-wider text-amber-100 uppercase mb-2 group-hover:text-amber-300 transition">
                Historique des Commandes
              </h4>
              <p className="text-xs text-stone-400">Consultez vos achats passés</p>
            </Link>

            <Link href="/wishlist" className="bg-stone-950 border border-amber-900/20 p-6 hover:border-amber-500 transition group">
              <h4 className="text-sm font-serif tracking-wider text-amber-100 uppercase mb-2 group-hover:text-amber-300 transition">
                Ma Liste d&apos;Envies
              </h4>
              <p className="text-xs text-stone-400">Vos favoris enregistrés</p>
            </Link>

            <Link href="/" className="bg-stone-950 border border-amber-900/20 p-6 hover:border-amber-500 transition group">
              <h4 className="text-sm font-serif tracking-wider text-amber-100 uppercase mb-2 group-hover:text-amber-300 transition">
                Continuer vos Achats
              </h4>
              <p className="text-xs text-stone-400">Découvrir la collection</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />

    </div>
  );
}

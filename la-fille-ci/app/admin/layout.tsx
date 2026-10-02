import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import prisma from '@/lib/prisma';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions as any);

  if (!session?.user?.id) {
    redirect('/admin/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  if (!user?.isAdmin) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-stone-900 border-r border-amber-900/20 min-h-screen">
          <div className="p-6">
            <Link href="/admin/dashboard" className="inline-block">
              <h2 className="text-xl font-serif tracking-wider text-amber-100 uppercase hover:text-amber-300 transition">
                Admin
              </h2>
            </Link>
          </div>
          <nav className="space-y-1 px-3">
            <Link href="/admin/dashboard" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Tableau de Bord
            </Link>
            <Link href="/admin/produits" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Produits
            </Link>
            <Link href="/admin/commandes" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Commandes
            </Link>
            <Link href="/admin/clients" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Clients
            </Link>
            <Link href="/admin/contenu" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Contenu
            </Link>
            <Link href="/admin/newsletter" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
              Newsletter
            </Link>
            <div className="border-t border-amber-900/20 pt-2 mt-2">
              <Link href="/" className="block px-3 py-2 text-sm text-stone-300 hover:bg-stone-800 hover:text-amber-100 rounded transition">
                ← Retour au site
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

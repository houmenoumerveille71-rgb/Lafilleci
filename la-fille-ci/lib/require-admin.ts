import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

/**
 * Garde-fou pour les routes API `/api/admin/*`.
 *
 * Verifie deux choses :
 *  1. qu'une session NextAuth existe ;
 *  2. que l'utilisateur est bien administrateur (isAdmin === true).
 *
 * A appeler en TOUT DEBUT de chaque handler. Si la reponse retournee n'est pas
 * null, il faut la renvoyer telle quelle au client :
 *
 *   const guard = await requireAdmin();
 *   if (guard) return guard;
 *
 * Le role est re-lu en base a chaque appel : on ne se fie pas au `isAdmin`
 * present dans le JWT, afin qu'une revocation de droit soit immediate.
 */
export async function requireAdmin() {
  const session = (await getServerSession(authOptions as any)) as {
    user?: { id?: string | number };
  } | null;

  // 401 : aucune session valide (visiteur non connecte)
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: 'Authentification requise' },
      { status: 401 },
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isAdmin: true },
  });

  // 403 : connecte, mais pas administrateur
  if (!user?.isAdmin) {
    return NextResponse.json(
      { error: 'Acces reserve aux administrateurs' },
      { status: 403 },
    );
  }

  // null = acces autorise
  return null;
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { isAdmin: true } });
    if (!user?.isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const { id } = await params;
    await prisma.review.delete({ where: { id: Number(id) } });
    return NextResponse.json({ message: 'Avis supprimé' });
  } catch (error) {
    console.error('Delete review error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

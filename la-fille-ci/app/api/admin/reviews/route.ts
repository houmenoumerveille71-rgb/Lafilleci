import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id;
    if (!userId) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { id: Number(userId) }, select: { isAdmin: true } });
    if (!user?.isAdmin) return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });

    const reviews = await prisma.review.findMany({ include: { product: true, user: true }, orderBy: { createdAt: 'desc' } });
    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Reviews list error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

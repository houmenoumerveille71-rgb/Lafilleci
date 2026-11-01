import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id;
    if (!userId) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }
    const { firstName, lastName, phone, image } = await request.json();
    await prisma.user.update({
      where: { id: Number(userId) },
      data: { firstName, lastName, phone, image },
    });
    return NextResponse.json({ message: 'Profil mis à jour' });
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

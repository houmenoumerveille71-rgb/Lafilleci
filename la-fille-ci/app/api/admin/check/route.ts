import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions as any);

    if (!session?.user?.id) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { isAdmin: true },
    });

    if (!user) {
      return NextResponse.json({ isAdmin: false }, { status: 404 });
    }

    return NextResponse.json({ isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Failed to check admin status:', error);
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

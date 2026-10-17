import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = (await getServerSession(authOptions as any)) as {
      user?: { id?: string | number };
    } | null;

    const numericUserId = Number(session?.user?.id);

    if (!session?.user?.id || !Number.isSafeInteger(numericUserId) || numericUserId <= 0) {
      return NextResponse.json({ isAdmin: false }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: numericUserId },
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

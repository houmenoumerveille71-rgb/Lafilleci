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

    const orders = await prisma.order.findMany({ orderBy: { createdAt: 'desc' } });
    const headers = ['ID', 'Client', 'Email', 'Total', 'Statut', 'Date'];
    const rows = orders.map((o) => [
      o.id,
      `${o.firstName} ${o.lastName}`,
      o.email,
      o.total,
      o.status,
      new Date(o.createdAt).toISOString(),
    ]);
    const csv = [headers, ...rows].map((r) => r.join(',')).join('\n');
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="commandes.csv"',
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Erreur export' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  // Garde-fou : cette route expose les coordonnees des clients
  // (nom, adresse, telephone, e-mail), elle est donc reservee aux administrateurs.
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const orders = await prisma.order.findMany({
      include: {
        user: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  // Garde-fou : la modification du statut d'une commande est reservee aux administrateurs.
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const order = await prisma.order.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { user: true, items: { include: { product: true } } },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Failed to update order:', error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    const order = await prisma.order.findUnique({ where: { id: orderId }, select: { id: true, status: true, paymentIntent: true, total: true } });
    if (!order) return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    console.error('Order status error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

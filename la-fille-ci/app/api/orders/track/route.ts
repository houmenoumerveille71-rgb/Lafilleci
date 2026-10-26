import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { orderNumber, email } = await request.json();

    if (!orderNumber && !email) {
      return NextResponse.json({ error: 'Numéro de commande ou email requis' }, { status: 400 });
    }

    const order = await prisma.order.findFirst({
      where: {
        ...(orderNumber ? { orderNumber } : {}),
        ...(email ? { email } : {}),
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Commande introuvable' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Track order error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue' }, { status: 500 });
  }
}

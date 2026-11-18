import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';
import { parsePrice } from '@/lib/price';
import { FedaPay, Transaction } from 'fedapay';

const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY || '';
const FEDAPAY_ENVIRONMENT = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';

FedaPay.setApiKey(FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(FEDAPAY_ENVIRONMENT as 'sandbox' | 'live');

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      items,
      email,
      firstName,
      lastName,
      address,
      city,
      zipCode,
      country,
      phone,
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    const requested = items.map((item: { productId?: number; quantity?: number }) => ({
      productId: Number(item.productId),
      quantity: Math.floor(Number(item.quantity)),
    }));

    if (requested.some((i) => !Number.isInteger(i.productId) || i.productId <= 0 || !Number.isInteger(i.quantity) || i.quantity <= 0)) {
      return NextResponse.json({ error: 'Panier invalide' }, { status: 400 });
    }

    const quantities = new Map<number, number>();
    for (const item of requested) {
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    }

    const products = await prisma.product.findMany({ where: { id: { in: Array.from(quantities.keys()) } } });
    if (products.length !== quantities.size) {
      return NextResponse.json({ error: "Un ou plusieurs produits n'existent plus" }, { status: 404 });
    }

    const pricedItems = products.map((product) => {
      const quantity = quantities.get(product.id)!;
      const unitAmount = parsePrice(String(product.price));
      if (unitAmount === null || unitAmount <= 0) throw new Error(`Prix invalide pour ${product.name}`);
      if (product.stock < quantity) throw new Error(`Stock insuffisant pour ${product.name}`);
      return { product, quantity, unitAmount };
    });

    const subtotal = pricedItems.reduce((sum, item) => sum + item.unitAmount * item.quantity, 0);
    const shipping = subtotal > 500 ? 0 : 25;
    const total = subtotal + shipping;

    const session = await getServerSession(authOptions as any);
    const userId = (session as any)?.user?.id ? Number((session as any).user.id) : null;

    const order = await prisma.order.create({
      data: {
        userId,
        email,
        firstName,
        lastName,
        address,
        city,
        zipCode,
        country,
        phone,
        total,
        status: 'pending',
        items: {
          create: pricedItems.map(({ product, quantity, unitAmount }) => ({
            productId: product.id,
            quantity,
            price: unitAmount,
          })),
        },
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_APP_URL manquant');

    const transaction = await Transaction.create({
      description: `Commande #${order.id} - La Fille-Ci`,
      amount: Math.round(total),
      currency: { iso: 'XOF' },
      callback_url: `${baseUrl}/commande/fedapay/retour?orderId=${order.id}`,
      customer: {
        firstname: firstName || 'Client',
        lastname: lastName || 'LaFilleCi',
        email: email && email.trim() ? email.trim() : 'client@lafille-ci.com',
        ...(phone ? { phone_number: { number: phone.replace(/\D/g, '').replace(/^229/, ''), country: 'bj' } } : {}),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: String(transaction.id) },
    });

    const token = await transaction.generateToken();

    return NextResponse.json({ url: token.url, orderId: order.id });
  } catch (error) {
    console.error('FedaPay checkout error:', error);
    const message = error instanceof Error ? error.message : 'Erreur lors de la création du paiement';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

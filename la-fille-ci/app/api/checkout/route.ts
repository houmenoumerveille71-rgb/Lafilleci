import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
    apiVersion: '2026-06-24.dahlia' as any,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, email, firstName, lastName, address, city, zipCode, country, phone } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { stock: true, name: true },
      });

      if (!product) {
        return NextResponse.json({ error: `Produit introuvable: ${item.name}` }, { status: 404 });
      }

      if (product.stock < item.quantity) {
        return NextResponse.json({ error: `Stock insuffisant pour ${product.name}` }, { status: 400 });
      }
    }

    const lineItems = items.map((item: { productId: number; name: string; price: number; quantity: number }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    const order = await prisma.order.create({
      data: {
        email,
        firstName,
        lastName,
        address,
        city,
        zipCode,
        country,
        phone,
        total: items.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0),
        status: 'pending',
        items: {
          create: items.map((item: { productId: number; price: number; quantity: number }) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/commande/success?orderId=${order.id}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/commande?canceled=true`,
      customer_email: email,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: session.id },
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 });
  }
}

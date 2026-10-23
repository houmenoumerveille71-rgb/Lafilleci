
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { parsePrice } from '@/lib/price';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia' as any,
});

// Frais de port exprimes en FCFA.
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 25;

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
      return NextResponse.json(
        { error: 'Panier vide' },
        { status: 400 }
      );
    }

    // Valider les identifiants et les quantites.
    const requested = items.map(
      (item: { productId?: number; quantity?: number }) => ({
        productId: Number(item.productId),
        quantity: Math.floor(Number(item.quantity)),
      })
    );

    if (
      requested.some(
        (i: { productId: number; quantity: number }) =>
          !Number.isInteger(i.productId) ||
          i.productId <= 0 ||
          !Number.isInteger(i.quantity) ||
          i.quantity <= 0
      )
    ) {
      return NextResponse.json(
        { error: 'Panier invalide' },
        { status: 400 }
      );
    }

    // Consolider les doublons du panier.
    const quantities = new Map<number, number>();

    for (const item of requested) {
      quantities.set(
        item.productId,
        (quantities.get(item.productId) || 0) + item.quantity
      );
    }

    // Relire les produits depuis la base de donnees.
    const products = await prisma.product.findMany({
      where: {
        id: { in: Array.from(quantities.keys()) },
      },
    });

    if (products.length !== quantities.size) {
      return NextResponse.json(
        { error: "Un ou plusieurs produits n'existent plus" },
        { status: 404 }
      );
    }

    const pricedItems = products.map(
      (product: {
        id: number;
        price: string;
        name: string;
        stock: number;
        image: string;
      }) => {
      const quantity = quantities.get(product.id)!;
      const unitAmount = parsePrice(String(product.price));

      if (unitAmount === null || unitAmount <= 0) {
        throw new Error(
          `Prix invalide pour le produit ${product.name}`
        );
      }

      if (product.stock < quantity) {
        throw new Error(
          `Stock insuffisant pour ${product.name}`
        );
      }

      return { product, quantity, unitAmount };
    });

    // Calcul du sous-total : sum est explicitement un nombre.
    const subtotal = pricedItems.reduce(
      (sum: number, item) =>
        sum + item.unitAmount * item.quantity,
      0
    );

    const shipping =
      subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;

    const total = subtotal + shipping;

    // Conversion en centimes pour Stripe.
    const toCents = (amount: number) =>
      Math.round(amount * 100);

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      pricedItems.map(({ product, quantity, unitAmount }) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            ...(product.image
              ? { images: [product.image] }
              : {}),
          },
          unit_amount: toCents(unitAmount),
        },
        quantity,
      }));

    // Creer la commande en attente.
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
        total,
        status: 'pending',
        items: {
          create: pricedItems.map(
            ({ product, quantity, unitAmount }) => ({
              productId: product.id,
              quantity,
              price: unitAmount,
            })
          ),
        },
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL;

    if (!baseUrl) {
      throw new Error(
        'La variable NEXTAUTH_URL est manquante'
      );
    }

    // Creer la session Stripe.
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url:
        `${baseUrl}/commande/success?orderId=${order.id}`,
      cancel_url:
        `${baseUrl}/commande?canceled=true`,
      customer_email: email,
      metadata: {
        orderId: order.id.toString(),
      },
    });

    // Enregistrer l'identifiant de la session.
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentIntent: session.id },
    });

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    if (
      error instanceof Error &&
      (
        error.message.startsWith('Stock insuffisant') ||
        error.message.startsWith('Prix invalide')
      )
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    console.error('Stripe checkout error:', error);

    return NextResponse.json(
      { error: 'Erreur lors de la création du paiement' },
      { status: 500 }
    );
  }
}

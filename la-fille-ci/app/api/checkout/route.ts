import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { parsePrice } from '@/lib/price';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2026-06-24.dahlia' as any,
});

// Frais de port exprimes dans la meme unite que les prix en base (FCFA).
// Aligne sur le frontend : livraison gratuite au-dela de 500, sinon 25.
const FREE_SHIPPING_THRESHOLD = 500;
const SHIPPING_COST = 25;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, email, firstName, lastName, address, city, zipCode, country, phone } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Panier vide' }, { status: 400 });
    }

    // On n'accepte du client que l'identifiant du produit et la quantite.
    // Le nom et le prix sont volontairement IGNORES : ils seront relus en base.
    const requested = items.map((item: { productId?: number; quantity?: number }) => ({
      productId: Number(item.productId),
      quantity: Math.floor(Number(item.quantity)),
    }));

    if (requested.some((i: { productId: number; quantity: number }) =>
      !Number.isInteger(i.productId) || i.productId <= 0 || !Number.isInteger(i.quantity) || i.quantity <= 0
    )) {
      return NextResponse.json({ error: 'Panier invalide' }, { status: 400 });
    }

    // Consolide les doublons : deux lignes pour le meme produit ne doivent
    // creer qu'une seule entree.
    const quantities = new Map<number, number>();
    for (const item of requested) {
      quantities.set(item.productId, (quantities.get(item.productId) || 0) + item.quantity);
    }

    // SOURCE DE VERITE : on relit les produits en base. Les prix envoyes par
    // le client sont ici completement ignores.
    const products = await prisma.product.findMany({
      where: { id: { in: Array.from(quantities.keys()) } },
    });

    if (products.length !== quantities.size) {
      return NextResponse.json({ error: 'Un ou plusieurs produits n existent plus' }, { status: 404 });
    }

    const pricedItems = products.map((product: { id: number; price: string; name: string; stock: number; image: string }) => {
      const quantity = quantities.get(product.id)!;
      const unitAmount = parsePrice(product.price);

      if (unitAmount === null || unitAmount <= 0) {
        throw new Error(`Prix invalide pour le produit ${product.name}`);
      }
      if (product.stock < quantity) {
        throw new Error(`Stock insuffisant pour ${product.name}`);
      }

      return { product, quantity, unitAmount };
    });

    const subtotal = pricedItems.reduce((sum, i) => sum + i.unitAmount * i.quantity, 0);
    const shipping = subtotal > FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
    const total = subtotal + shipping;

    // Les prix sont en unites (FCFA). Stripe attend des centimes : la
    // conversion se fait ici, au dernier moment, et nulle part ailleurs.
    const toCents = (amount: number) => Math.round(amount * 100);

    const lineItems = pricedItems.map(({ product, quantity, unitAmount }) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: product.name,
          ...(product.image ? { images: [product.image] } : {}),
        },
        unit_amount: toCents(unitAmount),
      },
      quantity,
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

    return NextResponse.json({
      sessionId: session.id,
      url: session.url,
      // Montants calcules serveur (en unites), renvoyes au client pour que
      // l'affichage corresponde exactement a ce qui sera reellement debite.
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    if (error instanceof Error && (error.message.startsWith('Stock insuffisant') || error.message.startsWith('Prix invalide'))) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Stripe checkout error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création du paiement' }, { status: 500 });
  }
}

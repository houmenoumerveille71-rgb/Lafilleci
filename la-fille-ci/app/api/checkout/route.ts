
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { parsePrice } from '@/lib/price';
import { transporter, EMAIL_FROM } from '@/lib/email';

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
      (sum: number, item: { unitAmount: number; quantity: number }) =>
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
      pricedItems.map(
        ({
          product,
          quantity,
          unitAmount,
        }: {
          product: { id: number; price: string; name: string; stock: number; image: string };
          quantity: number;
          unitAmount: number;
        }) => ({
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
            ({
              product,
              quantity,
              unitAmount,
            }: {
              product: { id: number };
              quantity: number;
              unitAmount: number;
            }) => ({
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

    // Envoyer l'email de confirmation avec lien de suivi
    try {
      const trackingUrl = `${baseUrl}/commande/suivi`;
      await transporter.sendMail({
        from: EMAIL_FROM,
        to: email,
        subject: `Confirmation de commande #${order.orderNumber || order.id} - La Fille-Ci`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #0f0f0f; color: #e5e5e5;">
            <h1 style="color: #d97706; text-align: center; font-family: 'Georgia', serif;">La Fille-Ci</h1>
            <h2 style="color: #ffffff;">Commande confirmée !</h2>
            <p>Bonjour ${firstName},</p>
            <p>Votre commande a bien été enregistrée. Nous la préparons avec soin.</p>
            
            <div style="background-color: #1a1a1a; border: 1px solid #d97706; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #d97706; margin-top: 0;">Détails de la commande</h3>
              <p><strong>Numéro :</strong> #${order.orderNumber || order.id}</p>
              <p><strong>Date :</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
              <p><strong>Total :</strong> ${total} FCFA</p>
              <p><strong>Statut :</strong> En attente de paiement</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${trackingUrl}" style="background-color: #d97706; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">
                Suivre ma commande
              </a>
            </div>

            <p style="color: #9ca3af; font-size: 14px;">
              Vous pouvez suivre l'acheminement de votre commande à tout moment via le lien ci-dessus ou en vous connectant à votre compte.
            </p>
            
            <p style="color: #9ca3af; font-size: 14px; text-align: center; margin-top: 30px;">
              Merci pour votre achat chez La Fille-Ci<br>
              Atelier de Luxe Premium
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Email confirmation error:', emailError);
      // Ne pas bloquer le checkout si l'email échoue
    }

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

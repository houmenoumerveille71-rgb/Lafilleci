import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { FedaPay, Transaction, Webhook } from 'fedapay';

const FEDAPAY_SECRET_KEY = process.env.FEDAPAY_SECRET_KEY || '';
const FEDAPAY_ENVIRONMENT = process.env.FEDAPAY_ENVIRONMENT || 'sandbox';
const FEDAPAY_WEBHOOK_SECRET = process.env.FEDAPAY_WEBHOOK_SECRET || '';

FedaPay.setApiKey(FEDAPAY_SECRET_KEY);
FedaPay.setEnvironment(FEDAPAY_ENVIRONMENT as 'sandbox' | 'live');

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-fedapay-signature') || '';

    let event: any;
    try {
      event = Webhook.constructEvent(rawBody, signature, FEDAPAY_WEBHOOK_SECRET);
    } catch (err) {
      console.error('Webhook signature error:', err);
      return NextResponse.json({ error: 'Signature invalide' }, { status: 400 });
    }

    const transactionData = event?.data?.object;
    const transactionId = transactionData?.id;
    if (!transactionId) {
      return NextResponse.json({ received: true });
    }

    const order = await prisma.order.findFirst({ where: { paymentIntent: String(transactionId) } });
    if (!order) {
      return NextResponse.json({ received: true });
    }

    // Idempotence
    if (order.status === 'paid' && event.name === 'transaction.approved') {
      return NextResponse.json({ received: true });
    }

    // Vérification serveur
    const transaction = await Transaction.retrieve(transactionId);
    if (transaction.amount !== Math.round(order.total)) {
      console.error('Montant mismatch');
      return NextResponse.json({ received: true });
    }

    if (event.name === 'transaction.approved') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'paid' } });
    } else if (event.name === 'transaction.canceled') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'canceled' } });
    } else if (event.name === 'transaction.declined') {
      await prisma.order.update({ where: { id: order.id }, data: { status: 'failed' } });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

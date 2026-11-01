import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdmin } from '@/lib/require-admin';

export async function GET() {
  // Garde-fou : seules les sessions d'administrateur sont acceptees.
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

import { transporter, EMAIL_FROM } from '@/lib/email';

export async function POST(request: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  try {
    const body = await request.json();
    const product = await prisma.product.create({
      data: {
        name: body.name,
        price: body.price,
        category: body.category,
        image: body.image || '',
        description: body.description || '',
        stock: body.stock || 0,
      },
    });

    const users = await prisma.user.findMany({ select: { email: true } });
    for (const u of users) {
      if (!u.email) continue;
      try {
        await transporter.sendMail({
          from: EMAIL_FROM,
          to: u.email,
          subject: `Nouveau produit : ${product.name}`,
          html: `<p>Un nouveau produit est disponible : ${product.name} (${product.price})</p>`,
        });
      } catch (e) {
        console.error('Notify user error:', e);
      }
    }

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

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

export async function POST(request: Request) {
  // Garde-fou : la creation de produit est reservee aux administrateurs.
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
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Failed to create product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}

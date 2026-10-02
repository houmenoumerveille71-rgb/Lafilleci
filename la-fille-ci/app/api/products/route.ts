import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    console.log('Prisma client:', !!prisma);
    console.log('Prisma product model:', !!prisma?.product);
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        category: true,
        image: true,
        description: true,
        stock: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
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

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    const where = userId ? { userId: Number(userId) } : {};

    const wishlist = await prisma.wishlistItem.findMany({
      where,
      include: {
        product: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(wishlist);
  } catch (error) {
    console.error('Failed to fetch wishlist:', error);
    return NextResponse.json({ error: 'Failed to fetch wishlist' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId, userId } = body;

    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        productId,
        userId: userId || 0,
      },
      include: {
        product: true,
      },
    });

    return NextResponse.json(wishlistItem, { status: 201 });
  } catch (error) {
    console.error('Failed to add to wishlist:', error);
    return NextResponse.json({ error: 'Failed to add to wishlist' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('productId');
    const userId = url.searchParams.get('userId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    const where: { productId: number; userId?: number } = { productId: Number(productId) };
    if (userId) {
      where.userId = Number(userId);
    }

    await prisma.wishlistItem.deleteMany({ where });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to remove from wishlist:', error);
    return NextResponse.json({ error: 'Failed to remove from wishlist' }, { status: 500 });
  }
}

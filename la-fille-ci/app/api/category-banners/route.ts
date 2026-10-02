import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const categoryBanners = await prisma.categoryBanner.findMany({
      where: { active: true },
      orderBy: { createdAt: 'asc' },
    });
    return NextResponse.json(categoryBanners);
  } catch (error) {
    console.error('Failed to fetch category banners:', error);
    return NextResponse.json({ error: 'Failed to fetch category banners' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categoryBanner = await prisma.categoryBanner.create({
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(categoryBanner, { status: 201 });
  } catch (error) {
    console.error('Failed to create category banner:', error);
    return NextResponse.json({ error: 'Failed to create category banner' }, { status: 500 });
  }
}

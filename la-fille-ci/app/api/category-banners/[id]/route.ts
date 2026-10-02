import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categoryBanner = await prisma.categoryBanner.findUnique({
      where: { id: parseInt(id) },
    });

    if (!categoryBanner) {
      return NextResponse.json({ error: 'Category banner not found' }, { status: 404 });
    }

    return NextResponse.json(categoryBanner);
  } catch (error) {
    console.error('Failed to fetch category banner:', error);
    return NextResponse.json({ error: 'Failed to fetch category banner' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const categoryBanner = await prisma.categoryBanner.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        slug: body.slug,
        image: body.image,
        active: body.active,
      },
    });

    return NextResponse.json(categoryBanner);
  } catch (error) {
    console.error('Failed to update category banner:', error);
    return NextResponse.json({ error: 'Failed to update category banner' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.categoryBanner.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete category banner:', error);
    return NextResponse.json({ error: 'Failed to delete category banner' }, { status: 500 });
  }
}

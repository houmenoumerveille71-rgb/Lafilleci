import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const post = await prisma.instagramPost.findUnique({
      where: { id: parseInt(id) },
    });

    if (!post) {
      return NextResponse.json({ error: 'Instagram post not found' }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to fetch instagram post:', error);
    return NextResponse.json({ error: 'Failed to fetch instagram post' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const post = await prisma.instagramPost.update({
      where: { id: parseInt(id) },
      data: {
        image: body.image,
        alt: body.alt,
        active: body.active,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Failed to update instagram post:', error);
    return NextResponse.json({ error: 'Failed to update instagram post' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.instagramPost.delete({
      where: { id: parseInt(id) },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete instagram post:', error);
    return NextResponse.json({ error: 'Failed to delete instagram post' }, { status: 500 });
  }
}

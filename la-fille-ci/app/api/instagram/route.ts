import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.instagramPost.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Failed to fetch instagram posts:', error);
    return NextResponse.json({ error: 'Failed to fetch instagram posts' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const post = await prisma.instagramPost.create({
      data: {
        image: body.image,
        alt: body.alt,
        active: body.active ?? true,
      },
    });
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Failed to create instagram post:', error);
    return NextResponse.json({ error: 'Failed to create instagram post' }, { status: 500 });
  }
}

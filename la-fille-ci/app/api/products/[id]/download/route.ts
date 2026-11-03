import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession(authOptions as any);
    if (!(session as any)?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { id } = await params;
    const productId = Number(id);
    if (!Number.isInteger(productId) || productId <= 0) {
      return NextResponse.json({ error: 'Produit invalide' }, { status: 400 });
    }

    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const index = Number(searchParams.get('index') || '0');
    const images = [...new Set([product.image, ...(product.images || [])].filter(Boolean))];
    if (!Number.isInteger(index) || index < 0 || index >= images.length) {
      return NextResponse.json({ error: 'Image invalide' }, { status: 400 });
    }

    const imageUrl = images[index];
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      return NextResponse.json({ error: 'Image introuvable' }, { status: 404 });
    }

    const contentType = imageRes.headers.get('content-type') || 'application/octet-stream';
    const buffer = await imageRes.arrayBuffer();
    const safeName = product.name.replace(/[^a-zA-Z0-9-_]/g, '_').slice(0, 50) || 'produit';
    const filename = `${safeName}_${index + 1}.jpg`;

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'private, no-store',
      },
    });
  } catch (error) {
    console.error('Download image error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any).isAdmin) {
      return NextResponse.json({ error: 'Accès admin requis' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'Fichier CSV requis' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const csvText = buffer.toString('utf-8');

    // Parse CSV simple
    const lines = csvText.split('\n').filter((line) => line.trim());
    if (lines.length < 2) {
      return NextResponse.json({ error: 'Le fichier CSV est vide ou invalide' }, { status: 400 });
    }

    // En-têtes attendus: name, price, category, image, stock, description
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
    const requiredHeaders = ['name', 'price', 'category'];

    for (const req of requiredHeaders) {
      if (!headers.includes(req)) {
        return NextResponse.json({
          error: `Colonne manquante: ${req}. Colonnes attendues: name, price, category, image, stock, description`
        }, { status: 400 });
      }
    }

    const createdProducts: any[] = [];
    const errors: any[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim() || '';
      });

      try {
        const price = parseFloat(row.price);
        const stock = parseInt(row.stock) || 0;

        if (isNaN(price)) {
          errors.push({ ligne: i + 1, erreur: 'Prix invalide' });
          continue;
        }

        const product = await prisma.product.create({
          data: {
            name: row.name,
            price: price.toString(),
            category: row.category || 'Nouveautés',
            image: row.image || '',
            stock: stock,
            description: row.description || '',
          },
        });

        createdProducts.push(product);
      } catch (err) {
        errors.push({ ligne: i + 1, erreur: err instanceof Error ? err.message : 'Erreur inconnue' });
      }
    }

    return NextResponse.json({
      created: createdProducts.length,
      errors: errors.length,
      products: createdProducts,
      errorDetails: errors,
    }, { status: 201 });
  } catch (error) {
    console.error('Bulk import error:', error);
    return NextResponse.json({ error: 'Une erreur est survenue lors de limport' }, { status: 500 });
  }
}

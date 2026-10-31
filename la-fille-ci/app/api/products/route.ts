
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

type ProductInput = {
  name?: string;
  price?: string | number;
  category?: string;
  image?: string;
  images?: string[];
  description?: string;
  stock?: number | string;
};

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return NextResponse.json(
      { error: 'Impossible de récupérer les produits.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Accepte un produit seul ou une liste de produits.
    const products: ProductInput[] = Array.isArray(body.products)
      ? body.products
      : [body];

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'Ajoute au moins un produit.' },
        { status: 400 }
      );
    }

    // Vérifie toutes les données avant de commencer l'enregistrement.
    const preparedProducts = products.map((product) => {
      const name = String(product.name ?? '').trim();
      const price = String(product.price ?? '').trim();
      const category = String(product.category ?? '').trim();
      const stock = Number(product.stock ?? 0);

      const images = Array.isArray(product.images)
        ? product.images.filter(
            (url): url is string =>
              typeof url === 'string' && url.trim().length > 0
          )
        : [];

      const image =
        typeof product.image === 'string' && product.image.trim()
          ? product.image.trim()
          : images[0] ?? '';

      if (!name || !price || !category) {
        throw new Error(
          'Chaque produit doit avoir un nom, un prix et une catégorie.'
        );
      }

      if (!Number.isSafeInteger(stock) || stock < 0) {
        throw new Error(
          `Le stock du produit "${name}" doit être un entier positif ou nul.`
        );
      }

      return {
        name,
        price,
        category,
        image,
        images: [...new Set([image, ...images].filter(Boolean))],
        description: String(product.description ?? ''),
        stock,
      };
    });

    // Enregistre tout dans une transaction : en cas d'échec,
    // aucun des nouveaux produits de cette opération n'est conservé.
    const createdProducts = await prisma.$transaction(
      preparedProducts.map((product) =>
        prisma.product.create({ data: product })
      )
    );

    return NextResponse.json(
      {
        message: 'Produits enregistrés avec succès.',
        created: createdProducts.length,
        products: createdProducts,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Failed to create products:', error);

    const message =
      error instanceof Error
        ? error.message
        : 'Une erreur est survenue lors de l’enregistrement.';

    const isValidationError =
      message.startsWith('Chaque produit') ||
      message.startsWith('Le stock');

    return NextResponse.json(
      { error: message },
      { status: isValidationError ? 400 : 500 }
    );
  }
}

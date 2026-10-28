import { Metadata } from 'next';
import { getProduct } from '@/lib/products';
import ClientProductPage from './ClientProductPage';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) {
    return { title: 'Produit non trouvé | La Fille-Ci' };
  }
  return {
    title: `${product.name} | La Fille-Ci`,
    description: product.category,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return null;
  }

  return <ClientProductPage id={id} product={product} />;
}

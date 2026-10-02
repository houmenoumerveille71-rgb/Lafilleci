import { Metadata } from 'next';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/products';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

const categoryMap: Record<string, string> = {
  sortie: 'Habits de Sortie',
  sport: 'Tenues de Sport',
  crochet: 'Tenues en Crochet',
};

const categoryTitles: Record<string, string> = {
  sortie: 'Habits de Sortie',
  sport: 'Tenues de Sport',
  crochet: 'Tenues en Crochet',
  nouveautes: 'Nouveautés',
  vente: 'Vente',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const title = categoryTitles[slug] || 'Collection';
  return {
    title: `${title} | La Fille-Ci`,
    description: `Découvrez notre collection ${title.toLowerCase()}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = categoryMap[slug];

  if (!category && slug !== 'nouveautes' && slug !== 'vente') {
    notFound();
  }

  const products = await getProducts();
  const filteredProducts = category
    ? products.filter((p) => p.category === category)
    : products;

  const title = categoryTitles[slug] || 'Collection';

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Collection
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            {title}
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm">Aucun produit disponible dans cette catégorie pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {filteredProducts.map((item) => (
              <ProductCard 
                key={item.id} 
                name={item.name} 
                price={item.price} 
                image={item.image}
                stock={item.stock}
                description={item.description}
                category={item.category}
              />
            ))}
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

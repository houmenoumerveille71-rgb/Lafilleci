
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProduct, getProducts } from "@/lib/products";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ClientProductPage from "./ClientProductPage";
type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return { title: "Produit non trouvé | La Fille-Ci" };
  }

  return {
    title: `${product.name} | La Fille-Ci`,
    description:
      product.description || product.category,
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    notFound();
  }

  const [allProducts, session] = await Promise.all([
    getProducts(),
    getServerSession(authOptions),
  ]);

  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.category === product.category &&
        p.id !== product.id
    )
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-8">
          <Link href="/" className="hover:text-amber-400">
            Accueil
          </Link>
          <span>/</span>
          <span>{product.category}</span>
          <span>/</span>
          <span className="text-amber-100">
            {product.name}
          </span>
        </nav>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div className="bg-stone-900 border border-amber-900/20 aspect-[3/4] flex items-center justify-center overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-stone-500">
                Image indisponible
              </span>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-amber-500 text-xs uppercase tracking-widest mb-3">
              {product.category}
            </p>

            <h1 className="text-3xl md:text-5xl font-serif text-amber-100 mb-5">
              {product.name}
            </h1>

            <p className="text-2xl text-amber-400 mb-7">
              {product.price}
            </p>

            <p className="text-stone-400 text-sm leading-relaxed mb-8">
              {product.description ||
                "Une pièce exceptionnelle qui allie élégance et raffinement."}
            </p>

            <p className="text-sm text-stone-400">
              Stock disponible : {product.stock}
            </p>
          </div>
        </section>

        <ClientProductPage id={id} product={product} />

        {relatedProducts.length > 0 && (
          <section className="py-14 border-t border-amber-900/20">
            <div className="text-center mb-10">
              <p className="text-xs text-amber-500 uppercase tracking-widest">
                Vous aimerez aussi
              </p>

              <h2 className="text-2xl md:text-4xl font-serif text-amber-100">
                Produits similaires
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
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
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
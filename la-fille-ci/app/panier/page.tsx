'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';
import CartItem from '@/components/CartItem';

export default function PanierPage() {
  const { items, totalPrice, clearCart } = useCart();
  const { addToast } = useToast();

  const handleClearCart = () => {
    clearCart();
    addToast('Panier vidé', 'info');
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      addToast('Votre panier est vide', 'error');
      return;
    }
    window.location.href = '/commande';
  };

  const shippingCost = totalPrice > 500 ? 0 : 25;
  const finalTotal = totalPrice + shippingCost;

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Votre
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Panier
          </h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-stone-400 text-sm mb-6">Votre panier est vide.</p>
            <Link 
              href="/"
              className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
            >
              Continuer vos Achats
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-6">
              {items.map((item) => (
                <CartItem 
                  key={item.id} 
                  id={item.id}
                  name={item.name} 
                  price={item.price} 
                  image={item.image} 
                  category={item.category}
                  quantity={item.quantity}
                />
              ))}
              
              <div className="flex justify-between items-center pt-4">
                <button 
                  onClick={handleClearCart}
                  className="text-xs text-stone-500 hover:text-amber-400 transition uppercase tracking-widest"
                >
                  Vider le panier
                </button>
                <Link 
                  href="/"
                  className="text-xs text-amber-400 hover:text-amber-300 transition uppercase tracking-widest"
                >
                  Continuer vos Achats
                </Link>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-stone-950 border border-amber-900/20 p-8 h-fit">
              <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-6">
                Récapitulatif
              </h3>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Sous-total</span>
                   <span className="text-amber-100">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Livraison</span>
                   <span className="text-amber-100">{shippingCost === 0 ? 'Gratuite' : `${shippingCost} FCFA`}</span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-stone-500">Livraison gratuite à partir de 500 FCFA</p>
                )}
                <div className="border-t border-amber-900/20 pt-4">
                  <div className="flex justify-between">
                    <span className="text-amber-200 uppercase tracking-widest">Total</span>
                     <span className="text-xl font-mono text-amber-400">{finalTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleCheckout}
                className="w-full bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition mb-4"
              >
                Procéder au Paiement
              </button>
              <Link 
                href="/commande"
                className="block text-center text-xs text-amber-400 hover:text-amber-300 transition"
              >
                Finaliser la commande
              </Link>
            </div>
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

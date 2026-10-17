'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

interface CheckoutFormProps {
  clientSecret: string;
  formData: {
    email: string;
    phone: string;
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    country: string;
  };
}

function CheckoutForm({ clientSecret, formData }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();
  const { addToast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setIsProcessing(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/commande/success`,
      },
      redirect: 'if_required',
    });

    if (error) {
      addToast(error.message || 'Erreur de paiement', 'error');
    } else {
      clearCart();
      addToast('Commande confirmée ! Merci pour votre achat.', 'success');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-stone-950 border border-amber-900/20 p-6">
        <h3 className="text-sm font-serif tracking-widest text-amber-200 uppercase mb-4">
          Informations de Livraison
        </h3>
        <div className="space-y-3 text-sm text-stone-300">
          <p>{formData.firstName} {formData.lastName}</p>
          <p>{formData.address}</p>
          <p>{formData.zipCode} {formData.city}</p>
          <p>{formData.country}</p>
          <p>{formData.email}</p>
          <p>{formData.phone}</p>
        </div>
      </div>

      <div className="bg-stone-950 border border-amber-900/20 p-6">
        <h3 className="text-sm font-serif tracking-widest text-amber-200 uppercase mb-4">
          Paiement
        </h3>
        <PaymentElement />
      </div>

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
      >
        {isProcessing ? 'Traitement...' : 'Payer'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    country: 'France',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const shippingCost = totalPrice > 500 ? 0 : 25;
  const finalTotal = totalPrice + shippingCost;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // On n'envoie QUE l'identifiant et la quantite : le prix et le nom
          // sont relus en base par le serveur, qui est seul a faire foi.
          // Envoyer un prix ici serait futile et potentiellement trompeur.
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          ...formData,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Erreur lors de la création du paiement');
      }

      setClientSecret(data.sessionId);
      setStep(2);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
        <Header />
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mb-4">
            Panier vide
          </h2>
          <p className="text-stone-400 mb-8">Ajoutez des articles avant de finaliser votre commande.</p>
          <a
            href="/"
            className="inline-block bg-amber-800/80 hover:bg-amber-700 text-amber-100 border border-amber-600/40 px-10 py-2.5 text-xs tracking-[0.25em] uppercase transition"
          >
            Découvrir la Collection
          </a>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-amber-50 font-sans selection:bg-amber-900 selection:text-white">
      
      <Header />

      <section className="py-16 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[10px] tracking-[0.3em] uppercase text-amber-500/80">
            Finaliser
          </span>
          <h2 className="text-3xl md:text-4xl font-serif tracking-widest text-amber-100 uppercase mt-1">
            Commande
          </h2>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-stone-950 border border-amber-900/20 p-8">
              <form onSubmit={handleShippingSubmit} className="space-y-6">
                <div>
                  <h3 className="text-sm font-serif tracking-widest text-amber-200 uppercase mb-4">
                    Contact
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Téléphone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-serif tracking-widest text-amber-200 uppercase mb-4">
                    Adresse de Livraison
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Prénom"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Nom"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Adresse"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                    />
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input
                        type="text"
                        name="city"
                        placeholder="Ville"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                      <input
                        type="text"
                        name="zipCode"
                        placeholder="Code Postal"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        required
                        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      />
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full bg-black border border-amber-900/40 text-xs px-4 py-3 text-stone-200 focus:outline-none focus:border-amber-500"
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Canada">Canada</option>
                        <option value="Luxembourg">Luxembourg</option>
                      </select>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-amber-800/80 hover:bg-amber-700 disabled:bg-stone-700 disabled:cursor-not-allowed text-amber-100 border border-amber-600/40 py-3 text-xs tracking-[0.25em] uppercase transition"
                >
                  {isLoading ? 'Chargement...' : 'Continuer vers le paiement'}
                </button>
              </form>
            </div>

            <div className="bg-stone-950 border border-amber-900/20 p-8 h-fit">
              <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-6">
                Récapitulatif
              </h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-amber-100">{item.name}</span>
                      <span className="text-stone-500 text-xs ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-amber-200">
                      {(parseFloat(item.price.replace(' FCFA', '').replace(',', '')) * item.quantity).toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-900/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Sous-total</span>
                   <span className="text-amber-100">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Livraison</span>
                   <span className="text-amber-100">{shippingCost === 0 ? 'Gratuite' : `${shippingCost} FCFA`}</span>
                </div>
                <div className="border-t border-amber-900/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-amber-200 uppercase tracking-widest">Total</span>
                     <span className="text-xl font-mono text-amber-400">{finalTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <Elements
                stripe={stripePromise}
                options={{ clientSecret, appearance: { theme: 'stripe' } }}
              >
                <CheckoutForm clientSecret={clientSecret} formData={formData} />
              </Elements>
            </div>

            <div className="bg-stone-950 border border-amber-900/20 p-8 h-fit">
              <h3 className="text-lg font-serif tracking-widest text-amber-100 uppercase mb-6">
                Récapitulatif
              </h3>
              
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <span className="text-amber-100">{item.name}</span>
                      <span className="text-stone-500 text-xs ml-2">x{item.quantity}</span>
                    </div>
                    <span className="text-amber-200">
                      {(parseFloat(item.price.replace(' FCFA', '').replace(',', '')) * item.quantity).toLocaleString()} FCFA
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-amber-900/20 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Sous-total</span>
                   <span className="text-amber-100">{totalPrice.toLocaleString()} FCFA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-400">Livraison</span>
                   <span className="text-amber-100">{shippingCost === 0 ? 'Gratuite' : `${shippingCost} FCFA`}</span>
                </div>
                <div className="border-t border-amber-900/20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-amber-200 uppercase tracking-widest">Total</span>
                     <span className="text-xl font-mono text-amber-400">{finalTotal.toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      <Footer />

    </div>
  );
}

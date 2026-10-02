import { useCart } from '@/context/CartContext';
import { useToast } from '@/context/ToastContext';

interface CartItemProps {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  quantity: number;
}

export default function CartItem({ id, name, price, image, category, quantity }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useCart();
  const { addToast } = useToast();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
      addToast('Produit retiré du panier', 'info');
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeFromCart(id);
    addToast('Produit retiré du panier', 'info');
  };

  const itemTotal = parseFloat(price.replace(' FCFA', '').replace(',', '')) * quantity;

  return (
    <div className="flex gap-6 bg-stone-950 border border-amber-900/20 p-6">
      <div className="w-24 h-32 bg-stone-900 border border-amber-900/20 flex items-center justify-center text-stone-600 text-xs">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <span>[ Image ]</span>
        )}
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-serif tracking-wider text-amber-100 mb-1">{name}</h3>
        <p className="text-xs text-stone-400 mb-4">{category}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-amber-900/40">
            <button 
              onClick={() => handleQuantityChange(quantity - 1)}
              className="px-3 py-1 text-amber-300 hover:text-amber-100 transition"
            >
              -
            </button>
            <span className="px-4 py-1 text-xs text-amber-100">{quantity}</span>
            <button 
              onClick={() => handleQuantityChange(quantity + 1)}
              className="px-3 py-1 text-amber-300 hover:text-amber-100 transition"
            >
              +
            </button>
          </div>
          <p className="text-sm font-mono text-amber-400">{itemTotal.toLocaleString()} FCFA</p>
        </div>
      </div>
      <button 
        onClick={handleRemove}
        className="text-stone-500 hover:text-amber-400 transition"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

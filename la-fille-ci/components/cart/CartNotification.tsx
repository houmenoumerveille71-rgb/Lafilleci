'use client';

import { useCart } from '@/context/CartContext';
import { useEffect, useState } from 'react';

export default function CartNotification() {
  const { notifications } = useCart();
  const [visibleNotification, setVisibleNotification] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (notifications.length > 0 && !visibleNotification) {
      const latest = notifications[notifications.length - 1];
      setVisibleNotification(latest.id);
      setIsAnimating(true);

      setTimeout(() => {
        setIsAnimating(false);
        setVisibleNotification(null);
      }, 2000);
    }
  }, [notifications, visibleNotification]);

  if (!visibleNotification || !isAnimating) return null;

  const notification = notifications.find((n) => n.id === visibleNotification);
  if (!notification) return null;

  return (
    <div
      className="fixed bottom-24 right-24 z-50 bg-amber-800 text-amber-100 border border-amber-600/40 px-4 py-2 rounded-lg shadow-xl text-xs tracking-wider uppercase flex items-center gap-2"
      style={{
        animation: 'flyToCart 1.5s ease-in forwards',
      }}
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
      </svg>
      {notification.productName}
    </div>
  );
}

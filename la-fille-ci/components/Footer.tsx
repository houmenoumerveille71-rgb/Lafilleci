import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-amber-900/30 pt-12 pb-8 px-6 text-xs text-stone-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        
        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Service Client</h4>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Expédition</h4>
          <p className="text-stone-500">Livraison rapide</p>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Retours</h4>
          <ul className="space-y-1 text-stone-500">
            <li><Link href="/retours" className="hover:text-stone-300">Politique de retours</Link></li>
            <li><Link href="/expeditions" className="hover:text-stone-300">Livraison</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Compte</h4>
          <ul className="space-y-1 text-stone-500">
            <li><Link href="/contact" className="hover:text-stone-300">Contact</Link></li>
            <li><Link href="/wishlist" className="hover:text-stone-300">Liste d&apos;Envies</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Réseaux Sociaux</h4>
            <div className="flex space-x-3 text-stone-300">
              <Link href="https://instagram.com/lafillestore" className="hover:text-amber-400" target="_blank">Instagram</Link>
              <Link href="https://pinterest.com/lafilleci" className="hover:text-amber-400" target="_blank">Pinterest</Link>
              <Link href="https://facebook.com/lafilleci" className="hover:text-amber-400" target="_blank">Facebook</Link>
            </div>
          </div>

          <div>
            <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Légal</h4>
            <ul className="space-y-1 text-stone-500">
              <li><Link href="/mentions-legales" className="hover:text-stone-300">Mentions Légales</Link></li>
              <li><Link href="/politique-confidentialite" className="hover:text-stone-300">Politique de Confidentialité</Link></li>
            </ul>
          </div>

      </div>

      {/* Boîte Newsletter */}
      <div className="max-w-md mx-auto text-center border-t border-amber-900/20 pt-8 mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80 block mb-3">
          Inscription Newsletter
        </span>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Votre email..."
            className="bg-black border border-amber-900/40 text-xs px-4 py-2 flex-1 text-stone-200 focus:outline-none focus:border-amber-500"
          />
          <button className="bg-amber-900/60 border border-amber-700/50 text-amber-100 text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-amber-800 transition">
            S&rsquo;ABONNER
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-stone-600 tracking-wider">
        © {new Date().getFullYear()} Lafille-ci, tous droits réservés
      </div>
    </footer>
  );
}

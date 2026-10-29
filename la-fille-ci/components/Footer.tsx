import Link from 'next/link';

const socials = [
  { name: 'Instagram', href: 'https://instagram.com/lafillestore', icon: 'M7.5 2h9A5.5 5.5 0 0 1 22 7.5v9a5.5 5.5 0 0 1-5.5 5.5h-9A5.5 5.5 0 0 1 2 16.5v-9A5.5 5.5 0 0 1 7.5 2zm0 2A3.5 3.5 0 0 0 4 7.5v9A3.5 3.5 0 0 0 7.5 20h9a3.5 3.5 0 0 0 3.5-3.5v-9A3.5 3.5 0 0 0 16.5 4h-9zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6zm5.25-2.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5z' },
  { name: 'Facebook', href: 'https://facebook.com/lafilleci', icon: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' },
  { name: 'Pinterest', href: 'https://pinterest.com/lafilleci', icon: 'M12 2a10 10 0 0 0-3.7 19.3c-.1-.8-.2-2 .1-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.4 1.8-2.4.9 0 1.3.7 1.3 1.5 0 .9-.6 2.3-.9 3.5-.3 1.1.5 2 1.6 2 1.9 0 3.2-2.4 3.2-5.2 0-2.2-1.4-3.8-4-3.8-2.9 0-4.7 2.1-4.7 4.5 0 .8.2 1.4.6 1.9.2.2.2.3.1.6l-.2.8c-.1.2-.2.3-.5.2-1.3-.5-1.9-1.8-1.9-3.3 0-2.4 2-5.2 6-5.2 3.2 0 5.3 2.3 5.3 4.8 0 3.3-1.8 5.7-4.5 5.7-1 0-1.8-.5-2.1-1.1l-.6 2.2c-.2.8-.8 1.9-1.2 2.5A10 10 0 1 0 12 2z' },
  { name: 'TikTok', href: 'https://tiktok.com/@lafilleci', icon: 'M19.6 6.4c-1.3-.9-2.2-2.3-2.4-3.9h-3.2v13.2a2.6 2.6 0 1 1-2.6-2.6c.3 0 .6 0 .9.1V9.9a5.8 5.8 0 1 0 5 5.7V9.3c1 .7 2.2 1.1 3.4 1.1V7.2c-.4 0-.8-.3-1.1-.8z' },
];

export default function Footer() {
  return (
    <footer className="bg-stone-950 border-t border-amber-900/30 pt-12 pb-8 px-4 sm:px-6 text-xs text-stone-400">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
        <div>
          <h3 className="text-amber-200 font-serif text-lg mb-3">La Fille-Ci</h3>
          <p className="text-stone-500 leading-relaxed">
            Boutique de mode féminine. Tenues de sortie, sport, crochet et nouveautés sélectionnées avec soin.
          </p>
          <div className="flex gap-3 mt-4">
            {socials.map((s) => (
              <Link key={s.name} href={s.href} target="_blank" aria-label={s.name} className="w-9 h-9 flex items-center justify-center border border-amber-900/40 text-amber-200 hover:bg-amber-900/40 hover:text-amber-100 transition">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                  <path d={s.icon} />
                </svg>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Boutique</h4>
          <ul className="space-y-2 text-stone-500">
            <li><Link href="/" className="hover:text-stone-300">Tout</Link></li>
            <li><Link href="/nouveau" className="hover:text-stone-300">Nouveautés</Link></li>
            <li><Link href="/sortie" className="hover:text-stone-300">Habits de Sortie</Link></li>
            <li><Link href="/sport" className="hover:text-stone-300">Tenues de Sport</Link></li>
            <li><Link href="/crochet" className="hover:text-stone-300">Tenues en Crochet</Link></li>
            <li><Link href="/vente" className="hover:text-stone-300">Vente</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Service Client</h4>
          <ul className="space-y-2 text-stone-500">
            <li><Link href="/contact" className="hover:text-stone-300">Contact</Link></li>
            <li><Link href="/commande/suivi" className="hover:text-stone-300">Suivi de commande</Link></li>
            <li><Link href="/retours" className="hover:text-stone-300">Retours &amp; Remboursements</Link></li>
            <li><Link href="/expeditions" className="hover:text-stone-300">Livraison</Link></li>
            <li><Link href="/faq" className="hover:text-stone-300">FAQ</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-amber-200 uppercase tracking-widest mb-3 text-[11px]">Contact</h4>
          <ul className="space-y-2 text-stone-500">
            <li>Cotonou, Bénin</li>
            <li><a href="tel:+22900000000" className="hover:text-stone-300">+229 00 00 00 00</a></li>
            <li><a href="mailto:contact@lafille-ci.com" className="hover:text-stone-300">contact@lafille-ci.com</a></li>
            <li>Lun - Sam : 9h - 18h</li>
          </ul>
        </div>
      </div>

      <div className="max-w-md mx-auto text-center border-t border-amber-900/20 pt-8 mb-8">
        <span className="text-[10px] uppercase tracking-[0.2em] text-amber-400/80 block mb-3">
          Inscription Newsletter
        </span>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            placeholder="Votre email..."
            className="bg-black border border-amber-900/40 text-xs px-4 py-2 flex-1 text-stone-200 focus:outline-none focus:border-amber-500"
          />
          <button className="bg-amber-900/60 border border-amber-700/50 text-amber-100 text-[10px] uppercase tracking-widest px-4 py-2 hover:bg-amber-800 transition whitespace-nowrap">
            S&apos;ABONNER
          </button>
        </div>
      </div>

      <div className="text-center text-[10px] text-stone-600 tracking-wider">
        © {new Date().getFullYear()} La Fille-Ci, tous droits réservés
      </div>
    </footer>
  );
}
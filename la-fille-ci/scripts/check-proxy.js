// Verifie que le proxy protege bien les pages /admin/* :
// un visiteur non connecte doit etre redirige vers /connexion-admin,
// tandis que la page de connexion elle-meme reste accessible.
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

const urls = ['/admin/dashboard', '/admin/commandes', '/admin/produits', '/connexion-admin'];

(async () => {
  let problem = false;
  for (const u of urls) {
    const res = await fetch(`${BASE_URL}${u}`, { redirect: 'manual' });
    const loc = res.headers.get('location') || '(aucune redirection)';
    let verdict;
    if (u === '/connexion-admin') {
      verdict = res.status === 200 ? 'OK    accessible' : 'ECHEC';
      if (res.status !== 200) problem = true;
    } else {
      const ok = res.status === 307 && loc.includes('/connexion-admin');
      verdict = ok ? 'OK    bloque -> connexion' : 'ECHEC';
      if (!ok) problem = true;
    }
    console.log(`${verdict}  ${u.padEnd(22)} [HTTP ${res.status}, Location: ${loc}]`);
  }
  console.log(problem ? '\n=> PROBLEME DETECTE' : '\n=> Protection des pages operationnelle');
})();
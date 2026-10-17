// Verifie que la protection des routes /api/admin/* fonctionne vraiment :
//   - sans session  -> 401 attendu
//   - avec session admin -> 200 attendu
//
// Utilise le flux NextAuth (CSRF + callback credentials) afin de'obtenir un
// vrai cookie de session, puis appelle les routes avec ce cookie.
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

let cookies = '';

async function get(url, options = {}) {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    redirect: 'manual',
    headers: { ...(options.headers || {}), ...(cookies ? { cookie: cookies } : {}) },
  });
  const set = res.headers.getSetCookie?.() || [];
  for (const c of set) {
    const pair = c.split(';')[0];
    if (pair && !cookies.includes(pair.split('=')[0])) cookies += (cookies ? '; ' : '') + pair;
  }
  let body = null;
  try { body = await res.json(); } catch { /* pas de JSON */ }
  return { status: res.status, body };
}

function check(label, ok, detail = '') {
  console.log(`  ${ok ? 'OK   ' : 'ECHEC'} ${label}${detail ? ` -> ${detail}` : ''}`);
  if (!ok) process.exitCode = 1;
}

async function main() {
  console.log(`Test de securite sur ${BASE_URL}\n`);

  console.log('=== 1. Sans session ===');
  for (const url of ['/api/admin/commandes', '/api/admin/produits']) {
    const res = await get(url);
    check(`GET ${url} refuse (401)`, res.status === 401, `recu ${res.status}`);
  }
  const patch = await get('/api/admin/commandes/1', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'cancelled' }),
  });
  check('PATCH /api/admin/commandes/:id refuse (401)', patch.status === 401, `recu ${patch.status}`);

  const create = await get('/api/admin/produits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Pirate', price: '0', category: 'x', image: '/x.jpg' }),
  });
  check('POST /api/admin/produits refuse (401)', create.status === 401, `recu ${create.status}`);

  console.log('\n=== 2. Avec session administrateur ===');
  await get('/api/auth/csrf');
  const login = await get('/api/auth/callback/credentials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      csrfToken: (await get('/api/auth/csrf')).body?.csrfToken || '',
      email: 'admin@lafille-ci.com',
      password: 'admin123',
      json: 'true',
    }).toString(),
  });
  check('Connexion admin acceptee', login.status === 200 || login.status === 302, `recu ${login.status}`);
  check('Cookie de session obtenu', cookies.includes('next-auth.session-token'), cookies ? 'cookie present' : 'aucun cookie');

  for (const url of ['/api/admin/commandes', '/api/admin/produits']) {
    const res = await get(url);
    check(`GET ${url} autorise (200)`, res.status === 200, `recu ${res.status}`);
  }
  const check2 = await get('/api/admin/check');
  check('GET /api/admin/check renvoie isAdmin=true', check2.body?.isAdmin === true, JSON.stringify(check2.body));

  console.log(process.exitCode ? '\n=> PROBLEME DETECTE' : '\n=> Protection operationnelle');
}

main().catch((e) => {
  console.error('Erreur :', e.message);
  process.exit(1);
});
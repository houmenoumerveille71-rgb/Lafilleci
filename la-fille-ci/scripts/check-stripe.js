// Verifie que les variables Stripe sont configurees et coherentes entre elles.
// Lancement : node scripts/check-stripe.js
// Ne modifie rien : affiche l'etat et, si besoin, la marche a suivre.

const fs = require('fs');
const path = require('path');

// Node ne charge pas le .env automatiquement : on le lit nous-memes.
const envPath = path.join(process.cwd(), '.env');
const values = {};
if (fs.existsSync(envPath)) {
  for (const rawLine of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq === -1) continue;
    const name = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    // Retire les guillemets eventuels
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    values[name] = val;
  }
}

const keys = [
  { key: 'STRIPE_SECRET_KEY', desc: 'Cle secrete du serveur (jamais exposee au navigateur)' },
  { key: 'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', desc: 'Cle publique, utilisee par le navigateur' },
  { key: 'STRIPE_WEBHOOK_SECRET', desc: 'Secret de signature du webhook' },
];

const value = (k) => process.env[k] || values[k] || '';

function inspect(key, raw) {
  if (!raw) return { state: 'ABSENTE', ok: false };
  if (raw.includes('...')) return { state: 'PLACEHOLDER (a remplacer)', ok: false };

  const prefixes = key === 'STRIPE_WEBHOOK_SECRET' ? ['whsec_'] : key === 'STRIPE_SECRET_KEY' ? ['sk_'] : ['pk_'];
  if (!prefixes.some((p) => raw.startsWith(p))) {
    return { state: `FORMAT INVALIDE (doit commencer par ${prefixes[0]})`, ok: false };
  }
  if (key === 'STRIPE_WEBHOOK_SECRET') return { state: 'CONFIGUREE', ok: true };
  if (raw.includes('_test_')) return { state: 'ENVIRONNEMENT TEST', ok: true };
  if (raw.includes('_live_')) return { state: 'ENVIRONNEMENT PRODUCTION', ok: true };
  return { state: 'FORMAT INCONNU', ok: false };
}

console.log('=== Variables Stripe ===');
let allOk = true;

for (const { key, desc } of keys) {
  const raw = value(key);
  const { state, ok } = inspect(key, raw);
  if (!ok) allOk = false;
  console.log(`  ${ok ? 'OK     ' : 'ALERTE '} ${key}`);
  console.log(`          ${state} - ${desc}`);
  console.log();
}

// Une cle secrete en mode test melangee a une publique en mode live
// fait echouer la creation de la session de paiement.
const secret = value('STRIPE_SECRET_KEY');
const pub = value('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY');
if (secret && pub && !secret.includes('...') && !pub.includes('...')) {
  const sameEnv = secret.includes('_test_') === pub.includes('_test_');
  console.log(`  ${sameEnv ? 'OK     ' : 'ALERTE '} Les deux cles sont du meme environnement`);
  if (!sameEnv) {
    console.log('          Stripe refusera la session de paiement.');
    allOk = false;
  }
  console.log();
}

if (allOk) {
  console.log('=> Configuration Stripe complete.');
  process.exit(0);
}

console.log('=> Configuration incomplete.');
console.log(`
----------------------------------------------------------------------
1. CREER UN COMPTE
   https://dashboard.stripe.com/register

2. RECUPERER LES CLES
   https://dashboard.stripe.com/test/apikeys
   Copier les deux cles telles quelles dans .env :
     STRIPE_SECRET_KEY="sk_test_XXXX"
     NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_XXXX"

3. INSTALLER LE CLI STRIPE (une seule fois)
   https://stripe.com/docs/stripe-cli
   winget install Stripe.StripeCli

4. OBTENIR LE SECRET DU WEBHOOK
   Terminal 1 : npm run dev
   Terminal 2 : stripe listen --forward-to localhost:3000/api/webhooks/stripe
   Le CLI affiche un secret whsec_XXXX : le coller dans .env
     STRIPE_WEBHOOK_SECRET="whsec_XXXX"

5. REDEMARRER LE SITE
   Arreter puis relancer : npm run dev

6. TESTER
   Carte de test : 4242 4242 4242 4242
   (date future, CVC quelconque)

Passer en production : repeter les etapes 2 et 4 en mode LIVE, puis
remplacer sk_test par sk_live et pk_test par pk_live.
`);
process.exit(1);
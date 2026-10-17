Ceci est un projet [Next.js](https://nextjs.org) amorcé avec [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Démarrage

Tout d'abord, lancez le serveur de développement :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en modifiant `app/page.tsx`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## En Savoir Plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - apprenez-en plus sur les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel Next.js interactif.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Base de données (MySQL + Prisma)

Le projet utilise **MySQL** avec **Prisma ORM**.

### Prérequis

- MySQL (ou MariaDB) démarré sur le port `3306`
- La connexion est définie dans `.env` :

```env
DATABASE_URL="mysql://root:@localhost:3306/lafilleci"
```

### ⚠️ Point important : moteur InnoDB

Prisma a besoin de **clés étrangères et de transactions**, qui ne sont supportées que par
**InnoDB**. Or le moteur par défaut de certaines installations (WAMP) est **MyISAM**, ce qui
provoque l'erreur suivante lors de la création du schéma :

```
ERROR 1071 (42000): La clé est trop longue. Longueur maximale: 1000
```

Vérifiez et corrigez le moteur par défaut du serveur :

```sql
SELECT @@default_storage_engine;   -- doit renvoyer InnoDB
SET GLOBAL default_storage_engine = InnoDB;
```

Pour rendre le changement permanent, éditez `my.ini` / `mysqld.cnf` :

```ini
default_storage_engine=InnoDB
```

### Créer la base et appliquer le schéma

```bash
# 1. Créer la base `lafilleci` (utf8mb4)
mysql -u root -h 127.0.0.1 -P 3306 < scripts/create-db.sql

# 2. Générer le client Prisma
npm run prisma:generate

# 3. Appliquer les migrations
npx prisma migrate deploy

# 4. Créer le compte administrateur
npm run seed:admin
```

Vérification :

```bash
npx prisma migrate status          # doit indiquer "Database schema is up to date!"
node scripts/test-db.js            # test CRUD + relations + transaction
```

### Modèles

| Modèle | Rôle |
| --- | --- |
| `Product` | Catalogue produits (prix, catégorie, stock) |
| `User` | Clients et administrateurs (`isAdmin`, mot de passe hashé) |
| `Order` / `OrderItem` | Commandes et lignes de commande |
| `WishlistItem` | Liste de favoris par utilisateur |
| `Account` / `Session` / `VerificationToken` | Authentification NextAuth |
| `NewsletterSubscriber` | Inscription à la newsletter |
| `Banner` / `CategoryBanner` / `InstagramPost` | Contenu éditorial de la vitrine |

> Attention : la table `Order` porte un nom SQL réservé, elle est donc créée avec des
> backticks (`` `Order` ``).

### Paiement (Stripe)

Le paiement ne fonctionne qu'avec de **vraies clés Stripe**. Les trois variables
suivantes sont actuellement des placeholders dans `.env` :

```env
STRIPE_SECRET_KEY="sk_test_..."                     # secrète, jamais exposée
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."    # publique, côté navigateur
STRIPE_WEBHOOK_SECRET="whsec_..."                   # signature du webhook
```

#### Mise en place

1. **Créer un compte** : https://dashboard.stripe.com/register
2. **Récupérer les clés** : https://dashboard.stripe.com/test/apikeys
   Coller les deux clés dans `.env` (`sk_test_...` et `pk_test_...`).
3. **Installer le CLI Stripe** (une seule fois) :
   ```bash
   winget install Stripe.StripeCli
   ```
4. **Obtenir le secret du webhook** — deux terminaux :
   ```bash
   # Terminal 1
   npm run dev
   # Terminal 2
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
   Le CLI affiche un secret `whsec_...` → le coller dans `.env`.
5. **Redémarrer le site**, puis vérifier :
   ```bash
   npm run stripe:check
   ```
6. **Tester** avec la carte de test : `4242 4242 4242 4242`
   (date future, CVC quelconque).

> Le webhook est ce qui confirme le paiement côté serveur. Sans lui, une commande
> reste en `pending` et le stock n'est jamais décrémenté.

#### Passer en production

Refaire les étapes 2 et 4 depuis le tableau de bord en mode **LIVE**, puis
remplacer `sk_test` par `sk_live` et `pk_test` par `pk_live`.

Les deux clés doivent toujours être du même environnement : mélanger
`sk_test` et `pk_live` fait échouer la création de la session.

> ⚠️ **Question devise** : le code utilise `currency: 'usd'` alors que les prix
> sont affichés en FCFA. Le franc CFA (XOF) n'est pas supporté par Stripe.
> Il faudra choisir entre une conversion en EUR/USD à taux fixe, ou une
> passerelle de paiement compatible Mobile Money.

### Sécurité

#### Routes d'administration

Toutes les routes `/api/admin/*` passent par `lib/require-admin.ts`, qui vérifie la
session **et** le rôle `isAdmin` (relu en base à chaque appel) :

```ts
const guard = await requireAdmin();
if (guard) return guard; // 401 sans session, 403 si non-admin
```

Les pages `/admin/*` sont filtrées par `proxy.ts`, qui redirige vers
`/connexion-admin` si aucune session n'est active.

> La page de connexion est **hors de `/admin/`** : placée dans `/admin/`, elle
> serait elle-même protégée et se redirigerait vers elle-même en boucle.

#### Prix jamais fiables côté client

Le panier n'envoie au serveur que `{ productId, quantity }`.
`/api/checkout` relit les produits **en base** et ignore tout `price` ou `name`
fourni par le client :

```ts
// app/api/checkout/route.ts
const products = await prisma.product.findMany({ where: { id: { in: [...] } } });
// le prix provient de product.price (base), jamais du body de la requete
```

La conversion vers les centimes exigés par Stripe se fait au dernier moment :
`unit_amount: Math.round(unitAmount * 100)`.

#### Vérifier la protection

```bash
# Serveur demarre, puis :
node scripts/check-admin.js    # 401 sans session / 200 avec session admin
node scripts/check-proxy.js    # pages /admin bloquees, connexion accessible
node scripts/check-prix.js     # un prix falsifie par le client est ignore
```

### Compte administrateur par défaut

Créé par `npm run seed:admin` :

- Email : `admin@lafille-ci.com`
- Mot de passe : `admin123`

> ⚠️ Changez ce mot de passe avant toute mise en production.

## Déployer sur Vercel

La façon la plus simple de déployer votre application Next.js est d'utiliser la [Plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation de déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.

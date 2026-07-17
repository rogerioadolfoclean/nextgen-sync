# Activer Stripe (Freemium / Pro / Enterprise)

Conforme à la règle projet : **chaque projet Stripe doit avoir son webhook
connecté et ses produits au catalogue.** L'application tourne en mode démo tant
que ces étapes ne sont pas faites — le checkout renvoie `{ demo: true }` au lieu
de rediriger.

## 1. Créer les produits au catalogue

Dans le [dashboard Stripe](https://dashboard.stripe.com/products) → **Produits**,
créer deux produits avec un prix récurrent mensuel :

| Produit | Prix / mois | Variable d'environnement |
| --- | --- | --- |
| NextGen Sync Pro | 12 € | `STRIPE_PRICE_PRO` = `price_...` |
| NextGen Sync Enterprise | 29 € | `STRIPE_PRICE_ENTERPRISE` = `price_...` |

Freemium n'a pas de produit (gratuit).

## 2. Connecter le webhook

Dashboard Stripe → **Développeurs → Webhooks → Ajouter un endpoint** :

- **URL** : `https://<votre-domaine>/api/stripe/webhook`
- **Événements** : `checkout.session.completed`, `customer.subscription.deleted`
- Copier le **secret de signature** → `STRIPE_WEBHOOK_SECRET` = `whsec_...`

## 3. Renseigner les variables sur Vercel

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO=price_...
STRIPE_PRICE_ENTERPRISE=price_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

Redéployer. Le checkout redirige alors vers Stripe et le webhook met à jour le
plan de l'abonné dans la table `users` / `subscriptions`.

## Test en local

```bash
stripe listen --forward-to localhost:3007/api/stripe/webhook
stripe trigger checkout.session.completed
```

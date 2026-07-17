# NextGen Sync

Plateforme professionnelle de communication et de collaboration unifiée :
visioconférence HD, tableau blanc collaboratif, sous-titres et traduction IA,
webinaires, sondages, enregistrements et messages vidéo — dans une seule
interface, sur PC, tablette et mobile.

## Références du projet

Ce dépôt reproduit **à l'identique** deux documents de référence :

| Référence | Fichier |
| --- | --- |
| Mockup (PC + tablette + mobile) | `Visioconférence Priorité ok.png` |
| Définition fonctionnelle | `Visioconférence Priorité ok.docx` |

Les couleurs du design system (`src/app/globals.css`) sont **échantillonnées au
pixel** depuis le mockup, pas approximées :

| Token | Valeur | Où dans le mockup |
| --- | --- | --- |
| `--color-primary` | `#2563eb` | Boutons Nouvelle réunion / Inviter |
| `--color-navy` | `#111a27` | Fond de la sidebar |
| `--color-navy-pill` | `#344d7b` | Item de navigation actif |
| `--color-canvas` | `#f9f9fb` | Fond du dashboard |
| `--color-danger` | `#e4433a` | Raccrocher, badge EN DIRECT |
| `--color-stage` | `#111923` | Barres haut/bas en réunion |

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** (thème inline, sans fichier de config)
- **PostgreSQL** (Neon) via `pg`
- **LiveKit** pour la visioconférence WebRTC HD
- **Stripe** pour les abonnements Freemium / Pro / Enterprise
- Déploiement **Vercel**

## Développement

```bash
npm install
npm run dev      # http://localhost:3007
```

## Variables d'environnement

Copier `.env.example` vers `.env.local` et renseigner les valeurs.

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | Connexion PostgreSQL Neon |
| `SESSION_SECRET` | Signature des cookies de session |
| `LIVEKIT_URL` / `LIVEKIT_API_KEY` / `LIVEKIT_API_SECRET` | Visioconférence temps réel |
| `ANTHROPIC_API_KEY` | Compte rendu, décisions, traduction (IA) |
| `DEEPGRAM_API_KEY` | Transcription et sous-titres en direct |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | Abonnements |

Sans les clés IA et LiveKit, l'application démarre et l'interface reste
entièrement navigable : les fonctions concernées passent en mode démo.

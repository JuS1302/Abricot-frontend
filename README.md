# Abricot — Frontend

Abricot est une application web de **gestion de projets et de tâches en équipe** (un peu comme Trello/Asana en plus simple) : on crée des projets, on invite des collègues dessus, on crée des tâches avec un statut (à faire / en cours / terminé), une priorité, une échéance, des personnes assignées, et on peut commenter chaque tâche.

Ce dépôt contient **uniquement la partie frontend** (ce que voit et utilise la personne dans son navigateur). Il a besoin d'un **backend séparé** (une API, non incluse dans ce dépôt) pour fonctionner complètement : c'est ce backend qui gère les comptes, les mots de passe, et qui stocke réellement les projets/tâches en base de données.

## Stack technique (avec quoi c'est construit)

- **Next.js 16** (App Router) — le framework React qui gère les pages et la navigation
- **React 19** — la bibliothèque qui affiche l'interface
- **TypeScript** — du JavaScript avec des types, pour éviter certaines erreurs avant même de lancer le code
- **Tailwind CSS** — pour le style (les classes comme `flex`, `text-primary`, etc. dans le code viennent de là)
- **OpenAI SDK + Groq** — utilisés uniquement pour une fonctionnalité d'assistant IA qui suggère des tâches (voir plus bas)

## Structure des dossiers (les plus importants)

```
src/
  app/
    (auth)/login/page.tsx        → page de connexion
    (auth)/register/page.tsx     → page d'inscription
    (dashboard)/dashboard/       → tableau de bord une fois connecté
    (dashboard)/projects/        → liste des projets et détail d'un projet
    (dashboard)/account/         → gestion du compte utilisateur
    api/ai/route.ts              → route interne qui appelle l'IA (Groq) pour suggérer des tâches
  components/ui/                 → composants réutilisables (boutons, cartes, modales...)
  context/AuthContext.tsx        → garde en mémoire "qui est connecté" pendant la session
  hooks/                         → logique réutilisable (ex: useLogin gère la connexion)
  lib/api.ts                     → toutes les fonctions qui parlent au backend (fetch)
  data/mock-data.json            → fausses données utilisées par le mode démo (voir plus bas)
  types/index.ts                 → les "formes" des données (User, Project, Task...)
```

Les dossiers entre parenthèses, comme `(auth)` et `(dashboard)`, sont une fonctionnalité de Next.js : ils organisent les fichiers sans apparaître dans l'URL (ex: `/login` et pas `/auth/login`).

## Lancer le projet en local

```bash
npm install     # installe les dépendances (une seule fois, ou après un changement de package.json)
npm run dev     # démarre le serveur de développement
```

Puis ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur. La page se recharge automatiquement à chaque modification du code.

Autres commandes utiles :

```bash
npm run build   # construit la version de production
npm run start   # lance la version construite (après npm run build)
npm run lint    # vérifie le code avec ESLint (repère les erreurs de style/qualité)
```

## Variables d'environnement

Créer un fichier `.env.local` à la racine (il n'est pas envoyé sur GitHub, c'est normal — chacun a le sien) :

```bash
# URL du backend (l'API qui gère comptes, projets, tâches...)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Clé API pour la fonctionnalité de suggestion de tâches par IA (optionnelle)
GROQ_API_KEY=xxxxxxxx
```

- `NEXT_PUBLIC_API_URL` : si elle n'est pas définie, le code utilise `http://localhost:8000` par défaut (voir `src/lib/api.ts`). Le préfixe `NEXT_PUBLIC_` est important : c'est ce qui permet à Next.js de rendre cette variable accessible côté navigateur (sans lui, la variable ne serait visible que côté serveur).
- `GROQ_API_KEY` : nécessaire seulement pour tester le bouton d'assistant IA sur les projets. Sans elle, le reste de l'application fonctionne normalement.

## Le mode démo (bouton "Voir la démo")

Sur la page de connexion, le bouton **"Voir la démo"** ne dépend pas du backend : il active un "mode démo" qui utilise de fausses données toutes prêtes dans `src/data/mock-data.json` (un utilisateur, deux projets, quelques tâches). C'est volontaire : ça permet de visiter l'application même sans backend qui tourne.

Ce mode est géré dans `src/lib/api.ts` par une variable `demoMode` : quand elle est activée (au clic sur "Voir la démo"), les fonctions comme `login`, `getProjects`, `getTasks`... renvoient directement les données de `mock-data.json` au lieu d'appeler le vrai backend. Elle se désactive automatiquement à la déconnexion, pour que la prochaine vraie connexion recontacte bien le backend.

**Limite à connaître** : en mode démo, la *lecture* des données est simulée, mais *créer/modifier/supprimer* un projet ou une tâche essaiera quand même de contacter le vrai backend (ces fonctions n'ont pas été branchées sur le mock). C'est pensé comme une visite guidée en lecture, pas comme un bac à sable complet.

## Authentification

- Une fois connecté (vraie connexion ou démo), le token et les infos utilisateur sont gardés **en mémoire React** (`src/context/AuthContext.tsx`), pas dans le `localStorage` : ça veut dire qu'un rafraîchissement de page (F5) déconnecte automatiquement. C'est un choix de sécurité assumé dans ce projet, pas un bug.
- Toutes les requêtes vers le backend qui nécessitent d'être connecté envoient le token dans l'en-tête `Authorization: Bearer <token>` (voir les fonctions dans `src/lib/api.ts`).

## Déploiement

Le plus simple est [Vercel](https://vercel.com/new), qui est fait par les créateurs de Next.js et détecte automatiquement la configuration du projet. Ne pas oublier d'y renseigner les variables d'environnement (`NEXT_PUBLIC_API_URL`, `GROQ_API_KEY`) dans les réglages du projet Vercel.

# Projet Coupons (React + Vite + PHP)

## Démarrage rapide

1) Frontend (React + Vite)
- Dans `frontend/`, installez Node.js 18+ si nécessaire (`https://nodejs.org/`)
- Exécutez `npm install`
- Ajoutez un fichier `.env` avec vos variables Firebase:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`
- Lancez le serveur: `npm run dev`

2) Stockage (Firebase Firestore)
- Créez un projet Firebase, activez Firestore en mode test ou ajoutez des règles adaptées (sans authentification utilisateur).
- La collection utilisée est `coupon_submissions`.

## Structure
Voir le dossier `frontend/` (React + Tailwind, React Router, react-hook-form, Toastify, Firebase). L'ancien backend PHP a été retiré.



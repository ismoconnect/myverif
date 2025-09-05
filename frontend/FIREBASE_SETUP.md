# Configuration Firebase - Variables d'Environnement

## ✅ Configuration Terminée

Votre configuration Firebase est maintenant configurée avec des variables d'environnement.

### 📁 Fichiers créés :

1. **`.env`** - Variables d'environnement (ignoré par Git)
2. **`src/config/firebase.js`** - Configuration Firebase centralisée
3. **`src/lib/firebase.js`** - Initialisation Firebase
4. **`ENV_SETUP.md`** - Documentation complète

### 🔧 Variables d'environnement configurées :

```env
VITE_FIREBASE_API_KEY=AIzaSyDmXDCUjbHHP_6mw6Xihb8A66Di0L7plaI
VITE_FIREBASE_AUTH_DOMAIN=myverif-67454.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myverif-67454
VITE_FIREBASE_STORAGE_BUCKET=myverif-67454.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1093371003509
VITE_FIREBASE_APP_ID=1:1093371003509:web:eb0c5f9390b644d4066e3c
```

### 🚀 Utilisation :

Les variables sont automatiquement chargées par Vite et utilisées dans :
- `src/config/firebase.js` - Configuration Firebase
- `src/lib/firebase.js` - Initialisation de l'app Firebase

### 🔒 Sécurité :

- ✅ Fichier `.env` ignoré par Git (dans `.gitignore`)
- ✅ Variables préfixées par `VITE_` pour Vite
- ✅ Configuration centralisée et réutilisable

### 🛠️ Développement :

Pour utiliser en développement :
```bash
cd frontend
npm run dev
```

Les variables d'environnement seront automatiquement chargées.

### 📦 Déploiement :

Pour Vercel/Netlify, ajoutez les variables d'environnement dans les paramètres de déploiement :
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 🔄 Alternative :

Si les variables d'environnement ne fonctionnent pas, décommentez la configuration directe dans `src/config/firebase.js`.

# Configuration des Variables d'Environnement

## Firebase Configuration

Votre configuration Firebase est maintenant intégrée directement dans le fichier `src/lib/firebase.js`.

### Configuration actuelle :
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyDmXDCUjbHHP_6mw6Xihb8A66Di0L7plaI",
  authDomain: "myverif-67454.firebaseapp.com",
  projectId: "myverif-67454",
  storageBucket: "myverif-67454.firebasestorage.app",
  messagingSenderId: "1093371003509",
  appId: "1:1093371003509:web:eb0c5f9390b644d4066e3c"
}
```

## Alternative avec Variables d'Environnement

Si vous préférez utiliser des variables d'environnement, créez un fichier `.env` dans le dossier `frontend/` avec :

```env
VITE_FIREBASE_API_KEY=AIzaSyDmXDCUjbHHP_6mw6Xihb8A66Di0L7plaI
VITE_FIREBASE_AUTH_DOMAIN=myverif-67454.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=myverif-67454
VITE_FIREBASE_STORAGE_BUCKET=myverif-67454.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1093371003509
VITE_FIREBASE_APP_ID=1:1093371003509:web:eb0c5f9390b644d4066e3c
```

Puis modifiez `src/lib/firebase.js` pour utiliser :
```javascript
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
```

## Sécurité

⚠️ **Important** : Les clés API Firebase sont publiques et peuvent être exposées côté client. 
Pour la sécurité, configurez les règles Firestore appropriées dans la console Firebase.

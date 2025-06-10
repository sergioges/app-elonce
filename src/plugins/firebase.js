import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// firebase functions:config:get --> Get API keys
// firebase functions:config:set --> Set API keys
// firebase functions:config:unset --> Unset API keys
// firebase deploy --only hosting:reservas-rustico-elonce
// firebase deploy --only functions
// firebase projects:list

// Configuración de Firebase (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FBASE_API_KEY,
  authDomain: import.meta.env.VITE_FBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FBASE_APP_ID,
  measurementId: import.meta.env.VITE_FBASE_MEASUREMENT_ID
}

// Inicializa Firebase
const app = initializeApp(firebaseConfig)

// Inicializa Firestore
const db = getFirestore(app)

// Inicializa Authentication
const auth = getAuth(app)

export { db, auth }

import {
  getApp,
  getApps,
  initializeApp,
  type FirebaseApp,
  type FirebaseOptions,
} from 'firebase/app'
import {
  createUserWithEmailAndPassword,
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type User,
} from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
} satisfies FirebaseOptions

const missingConfigKeys = Object.entries(firebaseConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key)

if (missingConfigKeys.length > 0) {
  throw new Error(
    `Missing Firebase environment config: ${missingConfigKeys.join(', ')}`,
  )
}

export const firebaseApp: FirebaseApp =
  getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)

export const firebaseAuth: Auth = getAuth(firebaseApp)

export const authService = {
  auth: firebaseAuth,

  getCurrentUser() {
    return firebaseAuth.currentUser
  },

  onAuthStateChange(callback: (user: User | null) => void) {
    return onAuthStateChanged(firebaseAuth, callback)
  },

  signInWithEmail(email: string, password: string) {
    return signInWithEmailAndPassword(firebaseAuth, email, password)
  },

  createAccountWithEmail(email: string, password: string) {
    return createUserWithEmailAndPassword(firebaseAuth, email, password)
  },

  signInWithGoogle() {
    const provider = new GoogleAuthProvider()

    return signInWithPopup(firebaseAuth, provider)
  },

  sendPasswordReset(email: string) {
    return sendPasswordResetEmail(firebaseAuth, email)
  },

  signOut() {
    return firebaseSignOut(firebaseAuth)
  },
}

import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyCrsSfOzIebLR770Oop7CXLP6q8jpQAxcw",
  authDomain: "digital-notes-60035.firebaseapp.com",
  projectId: "digital-notes-60035",
  storageBucket: "digital-notes-60035.firebasestorage.app",
  messagingSenderId: "550450677109",
  appId: "1:550450677109:web:35d72161e8aa5cdac17f3c",
  measurementId: "G-RKBV0VGSGJ",
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

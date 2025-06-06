import { initializeApp } from "firebase/app";
import { browserSessionPersistence, getAuth, setPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Set persistence to "session"
setPersistence(auth, browserSessionPersistence)
  .then(() => {
    console.log("Session persistence set.");
  })
  .catch((error) => {
    console.error("Error setting session persistence:", error);
  });

export const db = getFirestore(app);
export const storage = getStorage(app);

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// --- FIREBASE SETUP ---
// Replace the placeholder values below with your actual Firebase project credentials.
// You can find these in your Firebase project settings.
const firebaseConfig = {
  apiKey: "AIzaSyBqh0tIr4nmKB4KqHFKFcoX0lIPOqOKGxA",
  authDomain: "cp-store-85060.firebaseapp.com",
  databaseURL: "https://cp-store-85060-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cp-store-85060",
  storageBucket: "cp-store-85060.appspot.com",
  messagingSenderId: "779192570738",
  appId: "1:779192570738:web:7692c029d667c173b1c3eb"
};

declare const __app_id: string;

// This variable is provided by the environment, no need to change it.
export const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';

// Initialize Firebase and export instances
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// Export the Realtime Database instance
export const db = getDatabase(app);

// src/lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBqh0tIr4nmKB4KqHFKFcoX0lIPOqOKGxA",
  authDomain: "cp-store-85060.firebaseapp.com",
  databaseURL: "https://cp-store-85060-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cp-store-85060",
  storageBucket: "cp-store-85060.appspot.com",
  messagingSenderId: "779192570738",
  appId: "1:779192570738:web:7692c029d667c173b1c3eb",
  measurementId: "G-8XB2SD2WZL"
};

// pastikan app hanya di-init sekali
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// 👉 inilah yang harus diexport
export const db = getDatabase(app);

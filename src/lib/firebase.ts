// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqh0tIr4nmKB4KqHFKFcoX0lIPOqOKGxA",
  authDomain: "cp-store-85060.firebaseapp.com",
  databaseURL: "https://cp-store-85060-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "cp-store-85060",
  storageBucket: "cp-store-85060.firebasestorage.app",
  messagingSenderId: "779192570738",
  appId: "1:779192570738:web:7692c029d667c173b1c3eb",
  measurementId: "G-8XB2SD2WZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
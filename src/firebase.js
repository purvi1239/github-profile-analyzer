// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA3XTdQO3IQafW1e0y9P1lWeucCAT9BoQE",
  authDomain: "githubanalyzer-57551.firebaseapp.com",
  projectId: "githubanalyzer-57551",
  storageBucket: "githubanalyzer-57551.firebasestorage.app",
  messagingSenderId: "1088435872417",
  appId: "1:1088435872417:web:4689fc7da31e1134d7c6e0",
  measurementId: "G-E7GS7CCR12"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ EXPORT AUTH 
export const auth = getAuth(app);
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Replace the values below with the ones you copied from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyAb1YdtyuO5DMkc36k9zwWja_1HCOmeP94",
  authDomain: "mini-games-24412.firebaseapp.com",
  projectId: "mini-games-24412",
  storageBucket: "mini-games-24412.firebasestorage.app",
  messagingSenderId: "559460159940",
  appId: "1:559460159940:web:e412b9f8ac8a6e689d9491"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Authentication and export it so you can use it in LandingPage.jsx
export const auth = getAuth(app);
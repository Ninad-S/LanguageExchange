// src/firebase.js
// staging
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStripePayments } from '@stripe/firestore-stripe-payments';

const firebaseConfig = {
  apiKey: "AIzaSyC3Kkb7ZD6RuOneXJ5TlYBR0vQ65PQhcco",
  authDomain: "languagemate-18f43.firebaseapp.com",
  databaseURL: "https://languagemate-18f43-default-rtdb.firebaseio.com",
  projectId: "languagemate-18f43",
  storageBucket: "languagemate-18f43.firebasestorage.app",
  messagingSenderId: "429760668859",
  appId: "1:429760668859:web:fc7fbe3989c853c9d0f59e",
  measurementId: "G-S9SKJVSRXZ"
};

const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const db = getFirestore(app);
const rtdb = getDatabase(app); 
const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers"
});


export { app, auth, db, rtdb, payments};


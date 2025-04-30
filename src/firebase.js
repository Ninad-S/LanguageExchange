import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStripePayments } from "@stripe/firestore-stripe-payments";

console.log("Initializing Firebase...");

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

console.log("Firebase Config:", firebaseConfig);

const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app);

const auth = getAuth(app);
console.log("Firebase App Authorized:", auth);

const db = getFirestore(app);
console.log("Firestore Database Initialized:", db);

let rtdb = null;
try {
  if (firebaseConfig.databaseURL) {
    rtdb = getDatabase(app);
    console.log("Firebase Real-Time Database Initialized:", rtdb);
  } else {
    console.warn("No databaseURL provided. Skipping Real-Time Database initialization.");
  }
} catch (error) {
  console.error("Failed to initialize Firebase Real-Time Database:", error.message);
}

const payments = getStripePayments(app, {
  productsCollection: "products",
  customersCollection: "customers",
});
console.log("Stripe Payments Initialized:", payments);

console.log("Firebase Services Initialized: Auth, Firestore, RTDB (if available), Payments");

export { app, auth, db, rtdb, payments };
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStripePayments } from "@stripe/firestore-stripe-payments";

console.log("Initializing Firebase...");

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
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
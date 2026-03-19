// ═══════════════════════════════════════════════════════════════════════════
// Firebase Setup
// Replace the firebaseConfig below with YOUR project's config from the
// Firebase Console → Project Settings → General → Your apps → Web app.
// ═══════════════════════════════════════════════════════════════════════════

import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";

// ─── YOUR FIREBASE CONFIG ────────────────────────────────────────────────
// Replace these placeholder values with your real Firebase project config.
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:000000000000",
};

// Check if Firebase is configured
const isConfigured =
  firebaseConfig.apiKey !== "YOUR_API_KEY" &&
  firebaseConfig.apiKey !== "";

let app = null;
let auth = null;

if (isConfigured) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
}

// ─── Auth helpers ────────────────────────────────────────────────────────

export async function signIn(email, password) {
  if (!auth) throw new Error("Firebase not configured");
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(email, password, displayName) {
  if (!auth) throw new Error("Firebase not configured");
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });
  return cred;
}

export async function signOut() {
  if (!auth) {
    // Dev-mode logout
    window.__devUser = null;
    window.dispatchEvent(new Event("dev-logout"));
    return;
  }
  return firebaseSignOut(auth);
}

export async function getIdToken() {
  if (!auth || !auth.currentUser) return null;
  return auth.currentUser.getIdToken();
}

export function onAuth(callback) {
  if (!auth) {
    // Dev mode: call back with null (user will get a demo login button)
    setTimeout(() => callback(null), 100);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

export { isConfigured, auth };

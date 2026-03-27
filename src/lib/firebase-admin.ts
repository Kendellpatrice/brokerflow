import { getApps, initializeApp, cert, App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp(): App {
  if (getApps().length > 0) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      // Vercel stores newlines as \n literals — replace them back
      privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/** Mint a custom token for any arbitrary UID (e.g. a client's email address). */
export async function createCustomToken(uid: string): Promise<string> {
  return getAuth(getAdminApp()).createCustomToken(uid);
}

/** Admin Firestore instance — bypasses security rules entirely. */
export function getAdminDb() {
  return getFirestore(getAdminApp());
}

/** Admin Auth instance — for server-side token verification. */
export function getAdminAuth() {
  return getAuth(getAdminApp());
}

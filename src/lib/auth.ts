import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signOut, signInWithCustomToken } from 'firebase/auth';
import app from './firebase';

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function signInWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signInWithToken(customToken: string) {
  return signInWithCustomToken(auth, customToken);
}

export async function logout() {
  return signOut(auth);
}

import { getFirestore, doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import app from './firebase';

export const db = getFirestore(app);

export async function saveLeadData(uid: string, data: Record<string, unknown>) {
  await setDoc(doc(db, 'leads', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function loadLeadData(uid: string) {
  const snap = await getDoc(doc(db, 'leads', uid));
  return snap.exists() ? snap.data() : null;
}

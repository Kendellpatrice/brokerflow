import { getFirestore, doc, setDoc, serverTimestamp, collection, query, where, getDocs } from 'firebase/firestore';
import app from './firebase';

export const db = getFirestore(app);

// Cached after the first load so saves don't need an extra query
let cachedLeadId: string | null = null;

export function getCachedLeadId(): string | null {
  return cachedLeadId;
}

export async function loadLeadData(email: string) {
  const snap = await getDocs(
    query(collection(db, 'brokerLeads'), where('email', '==', email))
  );
  if (snap.empty) return null;
  cachedLeadId = snap.docs[0].id;
  return snap.docs[0].data();
}

export async function saveLeadData(email: string, data: Record<string, unknown>) {
  if (!cachedLeadId) {
    const snap = await getDocs(
      query(collection(db, 'brokerLeads'), where('email', '==', email))
    );
    if (snap.empty) return;
    cachedLeadId = snap.docs[0].id;
  }
  await setDoc(doc(db, 'brokerLeads', cachedLeadId), { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

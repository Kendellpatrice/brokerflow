import { db } from "@/lib/firestore";
import { doc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { logActivity } from "@/lib/activity";

export async function createAndSendInvite({
  brokerId,
  leadId,
  leadName,
  leadEmail,
  leadRef,
  previousToken,
}: {
  brokerId?: string;
  leadId: string;
  leadName: string;
  leadEmail: string;
  leadRef?: string;
  previousToken?: string;
}) {
  const token = crypto.randomUUID();
  const expiresAt = Timestamp.fromDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days

  // Mark the previous token as superseded so old links stop working immediately
  const writes: Promise<void>[] = [
    setDoc(doc(db, "brokerLeadInvites", token), { leadId, leadEmail, leadName, leadRef, expiresAt, superseded: false }),
    updateDoc(doc(db, "brokerLeads", leadId), { activeInviteToken: token }),
  ];

  if (previousToken) {
    writes.push(updateDoc(doc(db, "brokerLeadInvites", previousToken), { superseded: true }));
  }

  await Promise.all(writes);

  // API route only sends the email — no Firestore access server-side
  const res = await fetch("/api/send-invite", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ leadName, leadEmail, token }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to send invitation.");

  if (brokerId) {
    await logActivity({ brokerId, type: "invite_sent", leadName, leadId });
  }
}

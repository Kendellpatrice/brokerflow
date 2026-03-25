import { db } from "@/lib/firestore";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export type ActivityType = "lead_created" | "invite_sent" | "fact_find_submitted";

export async function logActivity({
  brokerId,
  type,
  leadName,
  leadId,
}: {
  brokerId: string;
  type: ActivityType;
  leadName: string;
  leadId: string;
}) {
  await addDoc(collection(db, "brokerActivity"), {
    brokerId,
    type,
    leadName,
    leadId,
    createdAt: serverTimestamp(),
  });
}

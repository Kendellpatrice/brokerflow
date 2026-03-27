import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { LeadProvider } from "@/context/lead";
import type { ReactNode } from "react";
import type { DocumentData } from "firebase-admin/firestore";

function serializeLeadData(data: DocumentData): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === "object" && typeof (value as { toDate?: unknown }).toDate === "function") {
      result[key] = (value as { toDate: () => Date }).toDate().toISOString();
    } else {
      result[key] = value;
    }
  }
  return result;
}

export default async function FactFindLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get("uid")?.value;

  if (!uid) {
    redirect("/login");
  }

  const db = getAdminDb();
  const snap = await db.collection("brokerLeads").where("email", "==", uid).limit(1).get();

  if (snap.empty) {
    redirect("/login");
  }

  const leadData = serializeLeadData(snap.docs[0].data());

  return <LeadProvider initialData={leadData}>{children}</LeadProvider>;
}

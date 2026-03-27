import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminDb } from "@/lib/firebase-admin";
import { BrokerProfileProvider } from "@/context/brokerProfile";
import type { BrokerProfile } from "@/context/brokerProfile";
import type { ReactNode } from "react";

export default async function BrokerPortalLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const uid = cookieStore.get("uid")?.value;

  if (!uid) {
    redirect("/login");
  }

  const db = getAdminDb();
  const snap = await db.collection("brokerProfiles").doc(uid).get();

  if (!snap.exists) {
    redirect("/broker/onboarding");
  }

  const data = snap.data()!;
  const profile: BrokerProfile = {
    uid,
    orgId: data.orgId,
    orgName: data.orgName,
    displayName: data.displayName,
    role: data.role,
  };

  return (
    <BrokerProfileProvider initialData={profile}>
      {children}
    </BrokerProfileProvider>
  );
}

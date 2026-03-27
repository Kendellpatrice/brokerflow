"use client";

import { createContext, useContext, ReactNode } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";

export interface BrokerProfile {
  uid: string;
  orgId: string;
  orgName: string;
  displayName: string;
  role: "owner" | "agent";
}

interface BrokerProfileContextValue {
  profile: BrokerProfile;
}

const BrokerProfileContext = createContext<BrokerProfileContextValue | null>(null);

export function BrokerProfileProvider({
  children,
  initialData,
}: {
  children: ReactNode;
  initialData: BrokerProfile;
}) {
  return (
    <BrokerProfileContext.Provider value={{ profile: initialData }}>
      {children}
    </BrokerProfileContext.Provider>
  );
}

export function useBrokerProfile() {
  const ctx = useContext(BrokerProfileContext);
  if (!ctx) throw new Error("useBrokerProfile must be used within BrokerProfileProvider");
  return ctx;
}

/** Creates org + broker profile doc. Call from onboarding page. */
export async function createOrgAndProfile({
  uid,
  orgName,
  displayName,
}: {
  uid: string;
  orgName: string;
  displayName: string;
}) {
  const orgId = crypto.randomUUID();
  await setDoc(doc(db, "organisations", orgId), {
    name: orgName,
    ownerId: uid,
    createdAt: new Date(),
  });
  await setDoc(doc(db, "brokerProfiles", uid), {
    orgId,
    orgName,
    displayName,
    role: "owner",
  });
  return { orgId };
}

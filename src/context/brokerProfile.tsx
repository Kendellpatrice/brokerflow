"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firestore";
import { useAuth } from "@/context/auth";

export interface BrokerProfile {
  uid: string;
  orgId: string;
  orgName: string;
  displayName: string;
  role: "owner" | "agent";
}

interface BrokerProfileContextValue {
  profile: BrokerProfile | null;
  loading: boolean;
  /** Call after onboarding to refresh */
  reload: () => void;
}

const BrokerProfileContext = createContext<BrokerProfileContextValue>({
  profile: null,
  loading: true,
  reload: () => {},
});

export function BrokerProfileProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<BrokerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [rev, setRev] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    getDoc(doc(db, "brokerProfiles", user.uid))
      .then((snap) => {
        if (snap.exists()) {
          setProfile({ uid: user.uid, ...(snap.data() as Omit<BrokerProfile, "uid">) });
        } else {
          setProfile(null);
        }
      })
      .finally(() => setLoading(false));
  }, [user, authLoading, rev]);

  return (
    <BrokerProfileContext.Provider value={{ profile, loading, reload: () => setRev((r) => r + 1) }}>
      {children}
    </BrokerProfileContext.Provider>
  );
}

export function useBrokerProfile() {
  return useContext(BrokerProfileContext);
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

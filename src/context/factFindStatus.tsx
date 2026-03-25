"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { serverTimestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import { loadLeadData, saveLeadData, getCachedLeadId } from "@/lib/firestore";
import { logActivity } from "@/lib/activity";

interface FactFindStatusContextValue {
  isSubmitted: boolean;
  loading: boolean;
  submit: () => Promise<void>;
}

const FactFindStatusContext = createContext<FactFindStatusContextValue>({
  isSubmitted: false,
  loading: true,
  submit: async () => {},
});

export function FactFindStatusProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [leadMeta, setLeadMeta] = useState<{ brokerId: string; fullName: string } | null>(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    loadLeadData(user.uid).then((data) => {
      if (data?.factFindStatus === "submitted") setIsSubmitted(true);
      if (data?.brokerId) {
        setLeadMeta({
          brokerId: data.brokerId as string,
          fullName: (data.fullName as string) ?? "",
        });
      }
      setLoading(false);
    });
  }, [user]);

  const submit = async () => {
    if (!user || isSubmitted) return;
    await saveLeadData(user.uid, {
      factFindStatus: "submitted",
      factFindSubmittedAt: serverTimestamp(),
    });
    const leadId = getCachedLeadId();
    if (leadId && leadMeta) {
      await logActivity({
        brokerId: leadMeta.brokerId,
        type: "fact_find_submitted",
        leadName: leadMeta.fullName,
        leadId,
      });
    }
    setIsSubmitted(true);
  };

  return (
    <FactFindStatusContext.Provider value={{ isSubmitted, loading, submit }}>
      {children}
    </FactFindStatusContext.Provider>
  );
}

export function useFactFindStatus() {
  return useContext(FactFindStatusContext);
}

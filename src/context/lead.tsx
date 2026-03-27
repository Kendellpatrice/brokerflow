"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useAuth } from "@/context/auth";
import { loadLeadData } from "@/lib/firestore";

interface LeadContextValue {
  leadData: Record<string, unknown> | null;
  loading: boolean;
}

const LeadContext = createContext<LeadContextValue>({ leadData: null, loading: true });

export function LeadProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [leadData, setLeadData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    loadLeadData(user.uid).then((data) => {
      setLeadData(data);
      setLoading(false);
    });
  }, [user, authLoading]);

  return (
    <LeadContext.Provider value={{ leadData, loading }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeadData() {
  return useContext(LeadContext);
}

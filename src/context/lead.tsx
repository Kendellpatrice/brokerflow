"use client";

import { createContext, useContext, ReactNode } from "react";

type LeadData = Record<string, unknown>;

interface LeadContextValue {
  leadData: LeadData;
}

const LeadContext = createContext<LeadContextValue>({ leadData: {} });

export function LeadProvider({ children, initialData }: { children: ReactNode; initialData: LeadData }) {
  return (
    <LeadContext.Provider value={{ leadData: initialData }}>
      {children}
    </LeadContext.Provider>
  );
}

export function useLeadData() {
  return useContext(LeadContext);
}

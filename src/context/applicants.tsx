"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type ApplicantRole = "Primary Applicant" | "Spouse / Partner" | "Business Partner" | "Co-Borrower";

export interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  role: ApplicantRole;
  isPrimary: boolean;
}

interface ApplicantContextValue {
  applicants: Applicant[];
  addApplicant: (a: Omit<Applicant, "id" | "isPrimary">) => void;
  removeApplicant: (id: string) => void;
  updateApplicant: (id: string, updates: Partial<Omit<Applicant, "id" | "isPrimary">>) => void;
}

const ApplicantContext = createContext<ApplicantContextValue | null>(null);

const DEFAULT_APPLICANTS: Applicant[] = [
  { id: "app-1", firstName: "", lastName: "", role: "Primary Applicant", isPrimary: true },
];

export function ApplicantProvider({ children }: { children: ReactNode }) {
  const [applicants, setApplicants] = useState<Applicant[]>(DEFAULT_APPLICANTS);

  const addApplicant = (a: Omit<Applicant, "id" | "isPrimary">) =>
    setApplicants(prev => [...prev, { ...a, id: `app-${Date.now()}`, isPrimary: false }]);

  const removeApplicant = (id: string) =>
    setApplicants(prev => prev.filter(a => a.id !== id));

  const updateApplicant = (id: string, updates: Partial<Omit<Applicant, "id" | "isPrimary">>) =>
    setApplicants(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));

  return (
    <ApplicantContext.Provider value={{ applicants, addApplicant, removeApplicant, updateApplicant }}>
      {children}
    </ApplicantContext.Provider>
  );
}

export function useApplicants() {
  const ctx = useContext(ApplicantContext);
  if (!ctx) throw new Error("useApplicants must be used within ApplicantProvider");
  return ctx;
}

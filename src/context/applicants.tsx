"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/auth";
import { saveLeadData, loadLeadData } from "@/lib/firestore";

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
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Track auth user
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  // Load applicants from Firestore when user signs in
  useEffect(() => {
    if (!user) { setLoaded(true); return; }
    loadLeadData(user.uid).then((data) => {
      let loaded: Applicant[] = DEFAULT_APPLICANTS;
      if (data?.applicants && Array.isArray(data.applicants) && data.applicants.length > 0) {
        loaded = data.applicants as Applicant[];
      }

      // If the primary applicant has no name, pre-fill from the pendingLeadName invite cookie
      const primary = loaded.find((a) => a.isPrimary);
      if (primary && !primary.firstName && !primary.lastName) {
        const match = document.cookie.split("; ").find((c) => c.startsWith("pendingLeadName="));
        if (match) {
          const name = decodeURIComponent(match.split("=")[1]).trim();
          const spaceIdx = name.lastIndexOf(" ");
          const firstName = spaceIdx > 0 ? name.slice(0, spaceIdx) : name;
          const lastName = spaceIdx > 0 ? name.slice(spaceIdx + 1) : "";
          loaded = loaded.map((a) => (a.isPrimary ? { ...a, firstName, lastName } : a));
        }
      }

      setApplicants(loaded);
      setLoaded(true);
    });
  }, [user]);

  // Save applicants to Firestore whenever they change (after initial load)
  useEffect(() => {
    if (!user || !loaded) return;
    saveLeadData(user.uid, { applicants });
  }, [applicants, user, loaded]);

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

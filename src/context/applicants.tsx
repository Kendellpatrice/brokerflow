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
      if (data?.applicants && Array.isArray(data.applicants) && data.applicants.length > 0) {
        setApplicants(data.applicants as Applicant[]);
      }
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

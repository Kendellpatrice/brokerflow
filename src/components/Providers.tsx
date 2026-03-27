"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";
import { AuthProvider } from "@/context/auth";
import { FactFindStatusProvider } from "@/context/factFindStatus";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FactFindStatusProvider>
        <ApplicantProvider>{children}</ApplicantProvider>
      </FactFindStatusProvider>
    </AuthProvider>
  );
}

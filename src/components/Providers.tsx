"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";
import { AuthProvider } from "@/context/auth";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <ApplicantProvider>{children}</ApplicantProvider>
    </AuthProvider>
  );
}

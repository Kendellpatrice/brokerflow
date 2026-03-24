"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";
import { AuthProvider } from "@/context/auth";
import { BrokerProfileProvider } from "@/context/brokerProfile";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BrokerProfileProvider>
        <ApplicantProvider>{children}</ApplicantProvider>
      </BrokerProfileProvider>
    </AuthProvider>
  );
}

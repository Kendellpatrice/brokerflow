"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";
import { AuthProvider } from "@/context/auth";
import { BrokerProfileProvider } from "@/context/brokerProfile";
import { FactFindStatusProvider } from "@/context/factFindStatus";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <BrokerProfileProvider>
        <FactFindStatusProvider>
          <ApplicantProvider>{children}</ApplicantProvider>
        </FactFindStatusProvider>
      </BrokerProfileProvider>
    </AuthProvider>
  );
}

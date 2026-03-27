"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";
import { AuthProvider } from "@/context/auth";
import { BrokerProfileProvider } from "@/context/brokerProfile";
import { FactFindStatusProvider } from "@/context/factFindStatus";
import { LeadProvider } from "@/context/lead";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LeadProvider>
        <BrokerProfileProvider>
          <FactFindStatusProvider>
            <ApplicantProvider>{children}</ApplicantProvider>
          </FactFindStatusProvider>
        </BrokerProfileProvider>
      </LeadProvider>
    </AuthProvider>
  );
}

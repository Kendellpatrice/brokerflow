"use client";

import { ReactNode } from "react";
import { ApplicantProvider } from "@/context/applicants";

export function Providers({ children }: { children: ReactNode }) {
  return <ApplicantProvider>{children}</ApplicantProvider>;
}

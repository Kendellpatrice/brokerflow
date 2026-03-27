"use client";

import { useLeadData } from "@/context/lead";

export function AppHeader() {
  const { leadData } = useLeadData();
  const leadRef = leadData?.ref as string | undefined;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white px-6 py-4 dark:bg-background-dark md:px-20">
      <div className="flex items-center gap-3">
        <div className="text-primary dark:text-slate-100">
          <svg
            className="size-8"
            fill="none"
            viewBox="0 0 48 48"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold uppercase tracking-tight text-primary dark:text-slate-100">
          uBroker
        </h2>
      </div>
      {leadRef && (
        <span className="hidden text-sm font-medium text-slate-600 dark:text-slate-400 md:block">
          Ref: {leadRef}
        </span>
      )}
    </header>
  );
}

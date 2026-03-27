"use client";

import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { AppHeader } from "./AppHeader";
import { useFactFindStatus } from "@/context/factFindStatus";
import { useRouter } from "next/navigation";
import { useLeadData } from "@/context/lead";

function PageShellInner({ children }: { children: ReactNode }) {
  const { isSubmitted } = useFactFindStatus();
  const { loading, leadData } = useLeadData();
  const router = useRouter();

  if (!loading && !leadData) {
    router.push("/login");
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
      <AppHeader />
      <main className="flex w-full grow flex-col md:flex-row">
        <SidebarNav />
        <section className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-12">
          {loading ? (
            <div className="flex h-full min-h-64 items-center justify-center">
              <div className="flex flex-col items-center gap-4 text-slate-400">
                <div className="size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
                <p className="text-sm font-medium">Loading your form…</p>
              </div>
            </div>
          ) : (
            <>
              {isSubmitted && (
                <div className="mx-auto mb-6 max-w-5xl flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
                  <span className="material-symbols-outlined shrink-0 text-[20px] text-emerald-600">check_circle</span>
                  <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
                    Your Fact Find has been submitted. This form is now read-only.
                  </p>
                </div>
              )}
              <fieldset disabled={isSubmitted} className="m-0 min-w-0 border-0 p-0">
                <div className="mx-auto max-w-5xl">{children}</div>
              </fieldset>
            </>
          )}
        </section>
      </main>
      <button
        type="button"
        className="fixed bottom-20 right-4 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-105 md:bottom-6 md:right-6"
        aria-label="Get help"
      >
        <span className="material-symbols-outlined text-3xl">chat_bubble</span>
      </button>
      <footer className="border-t border-primary/10 bg-white px-6 py-4 text-center dark:bg-background-dark/80">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          © {new Date().getFullYear()} uBroker Mortgage Solutions. All sensitive data is encrypted
          with bank-grade security.
        </p>
      </footer>
    </div>
  );
}

export function PageShell({ children }: { children: ReactNode }) {
  return <PageShellInner>{children}</PageShellInner>;
}

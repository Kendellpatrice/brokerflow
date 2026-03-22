import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
import { AppHeader } from "./AppHeader";

export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
      <AppHeader />
      <main className="flex w-full grow flex-col md:flex-row">
        <SidebarNav />
        <section className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-12">
          <div className="mx-auto max-w-5xl">{children}</div>
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

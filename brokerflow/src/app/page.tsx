import { SidebarNav } from "@/components/SidebarNav";
import Link from "next/link";
import Image from "next/image";

export default function IntroductionPage() {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {/* Header / Navigation */}
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
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-slate-600 dark:text-slate-400 md:block">
            Client: James &amp; Sarah Smith
          </span>
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
            <img
              alt="Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVTiH53nUWx2K08UJP04ET2KL0-kTlCzir8zZw3rNoV69RM2CUxestGhNa4A5ahcP819A5L4vFfKg1v6kPO58N0txgYEZ4mzHT4Tz_enrMUAug9t35ueraB-RtasfUOl7vHSF14QreLtZAfPIuEiwXikpuOGca7aU-qopaMCx8qOHXO_c3ancY66m-_tAwyDNZIfHP7hNypGTPsJ6lEUZDplwTXA8MVYXQao1Ifc7RiGm8_9ekTjbeGNlwtVzGCiF6fZ1_CajXQYRZ"
            />
          </div>
        </div>
      </header>

      <main className="flex w-full flex-grow flex-col md:flex-row">
        <SidebarNav />

        {/* Form Content */}
        <section className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-12">
          <div className="mx-auto max-w-4xl">
            <header className="mb-10">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Welcome to uBroker
              </span>
              <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
                Digital Fact Find
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
                Hi James &amp; Sarah, this digital fact find helps us understand your current financial situation, goals, and requirements so we can find the best mortgage solution for you.
              </p>
            </header>
            
            <div className="rounded-2xl border-2 border-primary/10 bg-white p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm mb-12">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6">What you will need</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center shrink-0 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">badge</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Identification</h3>
                    <p className="text-sm text-slate-500">A valid driver&apos;s license or passport for all applicants.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center shrink-0 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">receipt_long</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Income Evidence</h3>
                    <p className="text-sm text-slate-500">Most recent payslips or tax returns if self-employed.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center shrink-0 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">account_balance</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Asset Details</h3>
                    <p className="text-sm text-slate-500">Estimated value of current properties, vehicles, and savings.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex size-10 items-center justify-center shrink-0 rounded-full bg-primary/10 text-primary">
                    <span className="material-symbols-outlined">credit_score</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-white">Liability Information</h3>
                    <p className="text-sm text-slate-500">Current balances and repayments for loans and credit cards.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center rounded-2xl bg-primary/5 py-12 px-6 text-center border border-dashed border-primary/20">
              <h3 className="text-2xl font-bold text-primary mb-3">Ready to get started?</h3>
              <p className="text-slate-600 mb-8 max-w-md">It should take approximately 10-15 minutes to complete. You can always save your progress and return later.</p>
              
              <Link href="/applicants" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-bold text-white shadow-xl transition-all hover:bg-primary/90 hover:scale-[1.02]">
                Start Fact Find
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>

          </div>
        </section>
      </main>

      {/* Help Tooltip */}
      <button className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-105">
        <span className="material-symbols-outlined text-3xl">chat_bubble</span>
      </button>

      {/* Footer Info */}
      <footer className="border-t border-primary/10 bg-white px-6 py-4 text-center dark:bg-background-dark/80">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          © 2024 uBroker Mortgage Solutions. All sensitive data is encrypted with bank-grade security.
        </p>
      </footer>
    </div>
  );
}

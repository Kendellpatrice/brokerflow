import { PageShell } from "@/components/PageShell";
import Link from "next/link";

export default function IntroductionPage() {
  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Welcome to uBroker
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
          Fact Find Form
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 mb-8 max-w-3xl">
          Hi James &amp; Sarah, this digital fact find helps us understand your current financial
          situation, goals, and requirements so we can find the best mortgage solution for you.
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
        <p className="text-slate-600 mb-8">
          It should take approximately 10-15 minutes to complete. If you&apos;re unsure about any
          details, you can save your progress and return later. Your mortgage broker will also
          review all information during your consultation.
        </p>
        <Link
          href="/applicants"
          className="flex items-center gap-2 rounded-lg bg-primary px-10 py-4 font-bold text-white shadow-xl transition-all hover:bg-primary/90 hover:scale-[1.02]"
        >
          Start Fact Find
          <span className="material-symbols-outlined">arrow_forward</span>
        </Link>
      </div>
    </PageShell>
  );
}

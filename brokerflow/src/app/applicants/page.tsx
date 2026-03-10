import Link from "next/link";
import Image from "next/image";

export default function ApplicantsPage() {
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

      <main className="mx-auto flex w-full max-w-[1440px] flex-grow flex-col md:flex-row">
        {/* Sidebar Stepper */}
        <aside className="flex w-full flex-col gap-6 border-r border-primary/10 bg-white p-6 dark:bg-background-dark/50 md:w-80">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
                <span className="material-symbols-outlined">description</span>
              </div>
              <div>
                <h1 className="text-base font-bold text-primary dark:text-slate-100">
                  Fact Find Form
                </h1>
                <p className="text-xs text-slate-500">Ref: UB-2024-8832</p>
              </div>
            </div>
          </div>
          <nav className="flex flex-col gap-1">
            <Link href="/" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">info</span>
              <span className="text-sm font-medium">Introduction</span>
            </Link>
            <div className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="text-sm font-medium">Applicants</span>
            </div>
            <Link href="/personal-details" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span className="text-sm font-semibold">Personal Details</span>
            </Link>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">work</span>
              <span className="text-sm font-medium">Employment &amp; Income</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">account_balance</span>
              <span className="text-sm font-medium">Assets</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">credit_card</span>
              <span className="text-sm font-medium">Liabilities</span>
            </div>
            <div className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">account_balance_wallet</span>
              <span className="text-sm font-medium">Living Expenses</span>
            </div>
          </nav>
          <div className="mt-auto border-t border-primary/5 pt-6">
            <div className="mb-2 flex justify-between items-end">
              <span className="text-xs font-bold text-primary dark:text-slate-300">Form Progress</span>
              <span className="text-xs font-bold text-primary dark:text-slate-300">16%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full w-1/6 bg-primary"></div>
            </div>
            <p className="mt-4 text-[11px] italic leading-relaxed text-slate-500">
              Your progress is automatically saved as you go.
            </p>
          </div>
        </aside>

        {/* Form Content */}
        <section className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-12">
          <div className="mx-auto max-w-4xl">
            <header className="mb-10">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Step 1 of 6
              </span>
              <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
                Applicants
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Add all individuals or entities involved in this mortgage application. This helps us tailor the rest of the fact find.
              </p>
            </header>

            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Applicants</h3>
                  <button className="flex items-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10">
                    <span className="material-symbols-outlined text-lg">person_add</span>
                    <span>Add Another Applicant</span>
                  </button>
                </div>

                <div className="grid gap-4">
                  {/* Current Applicant 1 */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <span className="material-symbols-outlined text-2xl">person</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">James Wilson</h4>
                        <p className="text-sm text-slate-500">Primary Applicant • Main Borrower</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button
                        className="flex size-9 cursor-not-allowed items-center justify-center rounded-lg text-slate-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        title="Primary applicant cannot be removed"
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Current Applicant 2 */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200 border-l-4 border-l-primary bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-slate-100/50 text-slate-500 dark:bg-slate-800">
                        <span className="material-symbols-outlined text-2xl">person_outline</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">Sarah Wilson</h4>
                        <p className="text-sm text-slate-500">Secondary Applicant • Spouse/Partner</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="flex size-9 items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add new applicant box */}
              <div className="flex flex-col gap-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 dark:bg-slate-800/50">
                <div className="space-y-2 text-center flex flex-col items-center">
                  <h3 className="text-xl font-bold text-primary dark:text-white">Adding a new applicant?</h3>
                  <p className="max-w-md text-slate-600 dark:text-slate-400">
                    Selecting the correct relationship type ensures we collect the right documentation and financial data for everyone involved.
                  </p>
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
                  <label className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary dark:border-slate-800 dark:bg-slate-900">
                    <input className="absolute right-4 top-4 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" name="relationship" type="radio" />
                    <span className="material-symbols-outlined mb-2 text-3xl text-primary">favorite</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Spouse / Partner</span>
                    <span className="text-xs text-slate-500">Jointly responsible</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary dark:border-slate-800 dark:bg-slate-900">
                    <input className="absolute right-4 top-4 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" name="relationship" type="radio" />
                    <span className="material-symbols-outlined mb-2 text-3xl text-primary">business_center</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Business Partner</span>
                    <span className="text-xs text-slate-500">Commercial interest</span>
                  </label>
                  <label className="relative flex cursor-pointer flex-col rounded-xl border border-slate-200 bg-white p-4 transition-all hover:border-primary dark:border-slate-800 dark:bg-slate-900">
                    <input className="absolute right-4 top-4 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800" name="relationship" type="radio" />
                    <span className="material-symbols-outlined mb-2 text-3xl text-primary">group_add</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">Co-Borrower</span>
                    <span className="text-xs text-slate-500">Friend or relative</span>
                  </label>
                </div>
                <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                    <input
                      className="form-input w-full rounded border-slate-300 bg-white focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                      placeholder="Legal first name"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                    <input
                      className="form-input w-full rounded border-slate-300 bg-white focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                      placeholder="Legal last name"
                      type="text"
                    />
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3 pt-4">
                  <button className="rounded px-6 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800">Cancel</button>
                  <button className="rounded bg-primary px-8 py-2.5 font-bold text-white shadow transition-shadow hover:bg-primary/90">Confirm Applicant</button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
              <Link href="/" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <Link href="/personal-details" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
                Next Step
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
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

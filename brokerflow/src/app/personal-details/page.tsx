import Link from "next/link";
import Image from "next/image";

export default function PersonalDetailsPage() {
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
            <Link href="/applicants" className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400">
              <span className="material-symbols-outlined text-[20px]">group</span>
              <span className="text-sm font-medium">Applicants</span>
            </Link>
            <div className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-white shadow-sm">
              <span className="material-symbols-outlined text-[20px]">person</span>
              <span className="text-sm font-semibold">Personal Details</span>
            </div>
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
              <span className="text-xs font-bold text-primary dark:text-slate-300">33%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div className="h-full w-1/3 bg-primary"></div>
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
                Step 2 of 6
              </span>
              <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
                Personal Details
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Please provide the primary contact and identity information for all applicants
                associated with this mortgage application.
              </p>
            </header>

            {/* Applicant 1 Section */}
            <div className="mb-12">
              <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                <span className="material-symbols-outlined text-primary">looks_one</span>
                <h2 className="text-xl font-bold text-primary dark:text-slate-100">Applicant 1</h2>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <input
                    className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                    placeholder="e.g. James"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <input
                    className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                    placeholder="e.g. Smith"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                    placeholder="james.smith@example.com"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Phone Number
                  </label>
                  <input
                    className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                    placeholder="0400 000 000"
                    type="tel"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Marital Status
                  </label>
                  <select className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800">
                    <option>Select...</option>
                    <option>Single</option>
                    <option>Married</option>
                    <option>De Facto</option>
                    <option>Divorced</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Residency Status
                  </label>
                  <select className="rounded border-slate-300 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800">
                    <option>Select...</option>
                    <option>Citizen</option>
                    <option>Permanent Resident</option>
                    <option>Visa Holder</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Applicant 2 Section */}
            <div className="mb-12 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 p-8">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">looks_two</span>
                  <h2 className="text-xl font-bold text-primary dark:text-slate-100">Applicant 2</h2>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    className="rounded text-primary focus:ring-primary"
                    id="no-applicant-2"
                    type="checkbox"
                  />
                  <label
                    className="text-sm text-slate-600 dark:text-slate-400"
                    htmlFor="no-applicant-2"
                  >
                    No Second Applicant
                  </label>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 opacity-80 md:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    First Name
                  </label>
                  <input
                    className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="e.g. Sarah"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Last Name
                  </label>
                  <input
                    className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="e.g. Smith"
                    type="text"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                    type="email"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Relationship to Applicant 1
                  </label>
                  <select className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800">
                    <option>Spouse</option>
                    <option>Partner</option>
                    <option>Sibling</option>
                    <option>Friend / Investor</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Current Address */}
            <div className="mb-12">
              <div className="mb-6 flex items-center gap-2 border-b border-primary/10 pb-2">
                <span className="material-symbols-outlined text-primary">home_pin</span>
                <h2 className="text-xl font-bold text-primary dark:text-slate-100">
                  Current Residential Address
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Address Finder
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      search
                    </span>
                    <input
                      className="w-full rounded border-slate-300 pl-10 focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                      placeholder="Start typing your address..."
                      type="text"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <div className="col-span-2 flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Suburb
                    </label>
                    <input
                      className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      State
                    </label>
                    <select className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800">
                      <option>NSW</option>
                      <option>VIC</option>
                      <option>QLD</option>
                      <option>WA</option>
                      <option>SA</option>
                      <option>TAS</option>
                      <option>ACT</option>
                      <option>NT</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Postcode
                    </label>
                    <input
                      className="rounded border-slate-300 dark:border-slate-700 dark:bg-slate-800"
                      type="text"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
              <Link href="/applicants" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
                Next Step
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
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

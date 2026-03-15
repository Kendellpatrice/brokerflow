"use client";
/* eslint-disable @next/next/no-img-element */
import { SidebarNav } from "@/components/SidebarNav";
import Link from "next/link";
import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";

export default function EmploymentIncomePage() {
  const [employments, setEmployments] = useState<{ id: number, startDate?: string }[]>([{ id: 1, startDate: "" }]);

  const addEmployment = () => {
    setEmployments([...employments, { id: Date.now(), startDate: "" }]);
  };

  const removeEmployment = (idToRemove: number) => {
    setEmployments(employments.filter((emp) => emp.id !== idToRemove));
  };

  const updateEmploymentDate = (id: number, date: string) => {
    setEmployments(employments.map(emp => emp.id === id ? { ...emp, startDate: date } : emp));
  };

  const getOldestStartDate = () => {
    const dates = employments
      .map(e => e.startDate)
      .filter(Boolean)
      .map(d => new Date(d!).getTime())
      .filter(t => !isNaN(t));

    if (dates.length === 0) return null;
    return new Date(Math.min(...dates));
  };

  const oldestDate = getOldestStartDate();
  const hasLessThan3Years = oldestDate ? (new Date().getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25) < 3 : false;

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
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
                Step 3 of 6
              </span>
              <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
                Employment &amp; Income
              </h1>
              <p className="text-slate-600 dark:text-slate-400">
                Please provide details regarding your current employment, secondary jobs, previous employment, and all income sources.
              </p>
            </header>

            {/* Current Employment Section */}
            <div className="mb-12">
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-primary/10">
                  <span className="material-symbols-outlined text-primary">work</span>
                  <h2 className="text-xl font-bold text-primary dark:text-slate-100">Employment History</h2>
                  <span className="ml-2 text-xs font-normal italic text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">Min. 3 years required</span>
                </div>

                {employments.map((emp, index) => (
                  <div key={emp.id} className={index > 0 ? "mt-8 border-t border-slate-200 dark:border-slate-700 pt-8" : ""}>
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-slate-800 dark:text-slate-200">
                        {index === 0 ? "Primary Employment" : `Additional Employment ${index}`}
                      </h3>
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeEmployment(emp.id)}
                          className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Remove Role
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type of Employment</label>
                        <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                          <option>Select...</option>
                          <option>PAYG</option>
                          <option>Self-Employed</option>
                          <option>Unemployed</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                        <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                          <option>Select...</option>
                          <option>Full Time</option>
                          <option>Part Time</option>
                          <option>Casual</option>
                          <option>Contract</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sector</label>
                        <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                          <option>Select...</option>
                          <option>Public</option>
                          <option>Private</option>
                        </select>
                      </div>

                      <div className="hidden md:block"></div> {/* Spacer */}

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                        <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Address</label>
                        <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                      </div>

                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Occupation Role</label>
                        <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date with Company</label>
                        <input
                          className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                          type="date"
                          value={emp.startDate || ""}
                          onChange={(e) => updateEmploymentDate(emp.id, e.target.value)}
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gross Annual Income</label>
                        <CurrencyInput />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Employer Contact Name</label>
                        <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Employer Contact Number</label>
                        <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                      </div>

                    </div>
                  </div>
                ))}

                {hasLessThan3Years && (
                  <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-800 dark:border-blue-800/30 dark:bg-blue-900/20 dark:text-blue-200">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <span className="material-symbols-outlined text-[20px]">info</span>
                        Additional Job History Required
                      </div>
                      <p className="text-sm opacity-90 ml-7">
                        Lenders require a minimum of 3 years continuous employment history. Because your earliest stated start date is within the last 3 years, please provide your previous employment details.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addEmployment}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 py-4 font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
                    >
                      <span className="material-symbols-outlined">add_circle</span>
                      Add Previous Job
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Income Section */}
            <div className="mb-12">
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-primary/10">
                  <span className="material-symbols-outlined text-primary">attach_money</span>
                  <h2 className="text-xl font-bold text-primary dark:text-slate-100">Income Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Base Salary</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Income Frequency</label>
                    <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                      <option>Select...</option>
                      <option>Weekly</option>
                      <option>Fortnightly</option>
                      <option>Monthly</option>
                      <option>Yearly</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Overtime</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Commission / Bonuses</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Allowances</label>
                    <div className="grid grid-cols-2 gap-4">
                      <CurrencyInput placeholder="Amount" />
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" placeholder="Type (e.g. Car)" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Existing Rental Income</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Proposed Rental Income</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Investment Income (e.g. Share Dividends)</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Government Payments</label>
                    <div className="grid grid-cols-2 gap-4">
                      <CurrencyInput placeholder="Amount" />
                      <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                        <option>Select Type...</option>
                        <option>Family</option>
                        <option>Pension</option>
                        <option>Carer&apos;s</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Self Employed Applicants Section */}
            <div className="mb-12">
              <div className="bg-white border border-slate-200 rounded-xl p-6 md:p-8 dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-2 mb-6 pb-2 border-b border-primary/10">
                  <span className="material-symbols-outlined text-primary">storefront</span>
                  <h2 className="text-xl font-bold text-primary dark:text-slate-100">Self-Employed Applicants</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type of Entity</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trustee (if applicable)</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Beneficiaries</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="url" placeholder="https://" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">ABN / ACN</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Current FY)</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Previous FY)</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Current FY)</label>
                    <CurrencyInput />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Previous FY)</label>
                    <CurrencyInput />
                  </div>

                  <div className="col-span-1 md:col-span-2 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Accountant Details</h4>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>

                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
              <Link href="/personal-details" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <div className="flex items-center gap-6">
                <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">Save Draft</span>
                <Link href="/assets" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
                  Next Step
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">If you&apos;re unsure about any details, you can save your progress and return later. Your mortgage broker will also review all information during your consultation.</p>
                </div>
              </div>
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

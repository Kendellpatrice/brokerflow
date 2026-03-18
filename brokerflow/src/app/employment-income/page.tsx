"use client";

import { PageShell } from "@/components/PageShell";
import Link from "next/link";
import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";

export default function EmploymentIncomePage() {
  const [employments, setEmployments] = useState<{
    id: number;
    startDate?: string;
    type?: string;
  }[]>([{ id: 1, startDate: "", type: "" }]);

  const addEmployment = () => {
    setEmployments([...employments, { id: Date.now(), startDate: "", type: "" }]);
  };

  const removeEmployment = (idToRemove: number) => {
    setEmployments(employments.filter((emp) => emp.id !== idToRemove));
  };

  const updateEmploymentDate = (id: number, date: string) => {
    setEmployments(employments.map((emp) => (emp.id === id ? { ...emp, startDate: date } : emp)));
  };

  const updateEmploymentType = (id: number, type: string) => {
    setEmployments(employments.map((emp) => (emp.id === id ? { ...emp, type } : emp)));
  };

  const getOldestStartDate = () => {
    const dates = employments
      .map((e) => e.startDate)
      .filter(Boolean)
      .map((d) => new Date(d!).getTime())
      .filter((t) => !isNaN(t));

    if (dates.length === 0) return null;
    return new Date(Math.min(...dates));
  };

  const oldestDate = getOldestStartDate();
  const hasLessThan3Years = oldestDate
    ? (new Date().getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25) < 3
    : false;

  const hasSelfEmployed = employments.some((emp) => emp.type === "Self-Employed");

  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 3 of 6
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
          Employment &amp; Income
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please provide details regarding your current employment, secondary jobs, previous
          employment, and all income sources.
        </p>
      </header>

      {/* Employment History */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">work</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Employment History</h2>
            <span className="text-white/70 text-xs italic font-normal normal-case tracking-normal">(Min. 3 years required)</span>
          </div>
          <div className="p-6 md:p-8">
            {employments.map((emp, index) => (
              <div
                key={emp.id}
                className={index > 0 ? "mt-8 border-t border-slate-200 dark:border-slate-700 pt-8" : ""}
              >
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
                    <label htmlFor={`ei-emp-type-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Type of Employment
                    </label>
                    <select
                      id={`ei-emp-type-${emp.id}`}
                      value={emp.type || ""}
                      onChange={(e) => updateEmploymentType(emp.id, e.target.value)}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Select...</option>
                      <option value="PAYG">PAYG</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-status-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Status
                    </label>
                    <select
                      id={`ei-emp-status-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                    >
                      <option>Select...</option>
                      <option>Full Time</option>
                      <option>Part Time</option>
                      <option>Casual</option>
                      <option>Contract</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-sector-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Sector
                    </label>
                    <select
                      id={`ei-emp-sector-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                    >
                      <option>Select...</option>
                      <option>Public</option>
                      <option>Private</option>
                    </select>
                  </div>

                  <div className="hidden md:block"></div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-company-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Company Name
                    </label>
                    <input
                      id={`ei-emp-company-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-address-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Company Address
                    </label>
                    <input
                      id={`ei-emp-address-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-occupation-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Occupation Role
                    </label>
                    <input
                      id={`ei-emp-occupation-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-start-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Start Date with Company
                    </label>
                    <input
                      id={`ei-emp-start-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={emp.startDate || ""}
                      onChange={(e) => updateEmploymentDate(emp.id, e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-gross-income-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Gross Annual Income
                    </label>
                    <CurrencyInput id={`ei-gross-income-${emp.id}`} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-contact-name-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Employer Contact Name
                    </label>
                    <input
                      id={`ei-emp-contact-name-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-contact-number-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Employer Contact Number
                    </label>
                    <input
                      id={`ei-emp-contact-number-${emp.id}`}
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="tel"
                    />
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
                    Lenders require a minimum of 3 years continuous employment history. Because
                    your earliest stated start date is within the last 3 years, please provide
                    your previous employment details.
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
      </div>

      {/* Income Details */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">attach_money</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Income Details</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-base-salary" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Base Salary</label>
                <CurrencyInput id="ei-base-salary" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-income-frequency" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Income Frequency</label>
                <select
                  id="ei-income-frequency"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                >
                  <option>Select...</option>
                  <option>Weekly</option>
                  <option>Fortnightly</option>
                  <option>Monthly</option>
                  <option>Yearly</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-overtime" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Overtime</label>
                <CurrencyInput id="ei-overtime" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-commission" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Commission / Bonuses</label>
                <CurrencyInput id="ei-commission" />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="ei-allowances-amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Allowances</label>
                <div className="grid grid-cols-2 gap-4">
                  <CurrencyInput id="ei-allowances-amount" placeholder="Amount" />
                  <input
                    id="ei-allowances-type"
                    className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                    type="text"
                    placeholder="Type (e.g. Car)"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-rental-existing" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Existing Rental Income</label>
                <CurrencyInput id="ei-rental-existing" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-rental-proposed" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Proposed Rental Income</label>
                <CurrencyInput id="ei-rental-proposed" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-investment-income" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Investment Income (e.g. Share Dividends)</label>
                <CurrencyInput id="ei-investment-income" />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="ei-govt-amount" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Government Payments</label>
                <div className="grid grid-cols-2 gap-4">
                  <CurrencyInput id="ei-govt-amount" placeholder="Amount" />
                  <select
                    id="ei-govt-type"
                    className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  >
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
      </div>

      {/* Self-Employed Applicants — only shown when at least one employment type is Self-Employed */}
      {hasSelfEmployed && <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">storefront</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Self-Employed Applicants</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="ei-business-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
                <input
                  id="ei-business-name"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-entity-type" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type of Entity</label>
                <input
                  id="ei-entity-type"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-trustee" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trustee (if applicable)</label>
                <input
                  id="ei-trustee"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="ei-beneficiaries" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Beneficiaries</label>
                <input
                  id="ei-beneficiaries"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-website" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                <input
                  id="ei-website"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="url"
                  placeholder="https://"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-abn-acn" className="text-sm font-semibold text-slate-700 dark:text-slate-300">ABN / ACN</label>
                <input
                  id="ei-abn-acn"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-industry" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                <input
                  id="ei-industry"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-net-profit-current" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Current FY)</label>
                <CurrencyInput id="ei-net-profit-current" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-net-profit-previous" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Previous FY)</label>
                <CurrencyInput id="ei-net-profit-previous" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-add-backs-current" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Current FY)</label>
                <CurrencyInput id="ei-add-backs-current" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-add-backs-previous" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Previous FY)</label>
                <CurrencyInput id="ei-add-backs-previous" />
              </div>

              <div className="col-span-1 md:col-span-2 pt-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Accountant Details</h4>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-accountant-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name</label>
                <input
                  id="ei-accountant-name"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="text"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="ei-accountant-phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
                <input
                  id="ei-accountant-phone"
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                  type="tel"
                />
              </div>
            </div>
          </div>
        </div>
      </div>}

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
        <Link
          href="/personal-details"
          className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">
            Save Draft
          </span>
          <Link
            href="/assets"
            className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90"
          >
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
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you&apos;re unsure about any details, you can save your progress and return later.
              Your mortgage broker will also review all information during your consultation.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

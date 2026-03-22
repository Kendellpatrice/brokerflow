"use client";

import { PageShell } from "@/components/PageShell";
import { ApplicantTabs, CompletionStatus } from "@/components/ApplicantTabs";
import { useApplicants } from "@/context/applicants";
import Link from "next/link";
import { useState } from "react";
import { CurrencyInput } from "@/components/CurrencyInput";

// ── Per-applicant data shapes ─────────────────────────────────────────────
interface EmploymentRecord {
  id: number;
  startDate: string;
  type: string;
}

interface IncomeData {
  baseSalary: string;
  incomeFrequency: string;
  overtime: string;
  commission: string;
  allowancesAmount: string;
  allowancesType: string;
  rentalExisting: string;
  rentalProposed: string;
  investmentIncome: string;
  govtAmount: string;
  govtType: string;
}

interface SelfEmployedData {
  businessName: string;
  entityType: string;
  trustee: string;
  beneficiaries: string;
  website: string;
  abnAcn: string;
  industry: string;
  netProfitCurrent: string;
  netProfitPrevious: string;
  addBacksCurrent: string;
  addBacksPrevious: string;
  accountantName: string;
  accountantPhone: string;
}

interface ApplicantEmploymentData {
  employments: EmploymentRecord[];
  income: IncomeData;
  selfEmployed: SelfEmployedData;
}

const BLANK_INCOME: IncomeData = {
  baseSalary: "", incomeFrequency: "", overtime: "", commission: "",
  allowancesAmount: "", allowancesType: "", rentalExisting: "", rentalProposed: "",
  investmentIncome: "", govtAmount: "", govtType: "",
};

const BLANK_SE: SelfEmployedData = {
  businessName: "", entityType: "", trustee: "", beneficiaries: "",
  website: "", abnAcn: "", industry: "",
  netProfitCurrent: "", netProfitPrevious: "", addBacksCurrent: "", addBacksPrevious: "",
  accountantName: "", accountantPhone: "",
};

const blankApplicantData = (): ApplicantEmploymentData => ({
  employments: [{ id: Date.now(), startDate: "", type: "" }],
  income: { ...BLANK_INCOME },
  selfEmployed: { ...BLANK_SE },
});

// ── Completion heuristic ──────────────────────────────────────────────────
function completionStatus(data: ApplicantEmploymentData): CompletionStatus {
  const hasType  = data.employments.some(e => e.type);
  const hasDate  = data.employments.some(e => e.startDate);
  const hasIncome = data.income.baseSalary !== "";
  if (hasType && hasDate && hasIncome) return "complete";
  if (hasType || hasDate || hasIncome)  return "partial";
  return "empty";
}

// ── Input class ───────────────────────────────────────────────────────────
const inputCls = "rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary";

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════
export default function EmploymentIncomePage() {
  const { applicants } = useApplicants();
  const [activeId, setActiveId] = useState(() => applicants[0]?.id ?? "");

  // All per-applicant state lives here, keyed by applicant ID
  const [allData, setAllData] = useState<Record<string, ApplicantEmploymentData>>(() =>
    Object.fromEntries(applicants.map(a => [a.id, blankApplicantData()]))
  );

  const getData = (id: string): ApplicantEmploymentData =>
    allData[id] ?? blankApplicantData();

  const setData = (id: string, updater: (prev: ApplicantEmploymentData) => ApplicantEmploymentData) =>
    setAllData(prev => ({ ...prev, [id]: updater(prev[id] ?? blankApplicantData()) }));

  // ── Employment helpers for active applicant ───────────────────────────
  const { employments } = getData(activeId);

  const addEmployment = () =>
    setData(activeId, d => ({
      ...d,
      employments: [...d.employments, { id: Date.now(), startDate: "", type: "" }],
    }));

  const removeEmployment = (empId: number) =>
    setData(activeId, d => ({ ...d, employments: d.employments.filter(e => e.id !== empId) }));

  const updateEmploymentDate = (empId: number, date: string) =>
    setData(activeId, d => ({
      ...d,
      employments: d.employments.map(e => e.id === empId ? { ...e, startDate: date } : e),
    }));

  const updateEmploymentType = (empId: number, type: string) =>
    setData(activeId, d => ({
      ...d,
      employments: d.employments.map(e => e.id === empId ? { ...e, type } : e),
    }));

  // ── Derived values ────────────────────────────────────────────────────
  const dates = employments
    .map(e => e.startDate)
    .filter(Boolean)
    .map(d => new Date(d!).getTime())
    .filter(t => !isNaN(t));

  const oldestDate = dates.length > 0 ? new Date(Math.min(...dates)) : null;
  const now = new Date();
  const hasLessThan3Years = oldestDate
    ? (now.getTime() - oldestDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25) < 3
    : false;

  const hasSelfEmployed = employments.some(e => e.type === "Self-Employed");

  // ── Income helpers ────────────────────────────────────────────────────
  const income = getData(activeId).income;
  const setIncome = (field: keyof IncomeData, value: string) =>
    setData(activeId, d => ({ ...d, income: { ...d.income, [field]: value } }));

  // ── Self-employed helpers ─────────────────────────────────────────────
  const se = getData(activeId).selfEmployed;
  const setSE = (field: keyof SelfEmployedData, value: string) =>
    setData(activeId, d => ({ ...d, selfEmployed: { ...d.selfEmployed, [field]: value } }));

  // ── Completion map for tabs ───────────────────────────────────────────
  const completionMap = Object.fromEntries(
    applicants.map(a => [a.id, completionStatus(getData(a.id))])
  );

  const sid = activeId; // short alias for id-suffixing

  return (
    <PageShell>
      <header className="mb-8">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 3 of 6
        </span>
        <h1 className="mb-4 text-3xl sm:text-4xl font-extrabold text-primary dark:text-slate-100">
          Employment &amp; Income
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please provide employment and income details for each applicant.
        </p>
      </header>

      <ApplicantTabs
        applicants={applicants}
        activeId={activeId}
        onSelect={setActiveId}
        completionMap={completionMap}
      />

      {/* Employment History */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">work</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Employment History</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            {employments.map((emp, index) => (
              <div
                key={emp.id}
                className={index > 0 ? "mt-8 border-t border-slate-200 dark:border-slate-700 pt-8" : ""}
              >
                <div className="flex flex-col gap-2 mb-6 sm:flex-row sm:items-center sm:justify-between">
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
                    <label htmlFor={`ei-emp-type-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Type of Employment
                    </label>
                    <select
                      id={`ei-emp-type-${sid}-${emp.id}`}
                      value={emp.type}
                      onChange={e => updateEmploymentType(emp.id, e.target.value)}
                      className={inputCls}
                    >
                      <option value="">Select...</option>
                      <option value="PAYG">PAYG</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-status-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Status</label>
                    <select id={`ei-emp-status-${sid}-${emp.id}`} className={inputCls}>
                      <option>Select...</option>
                      <option>Full Time</option><option>Part Time</option><option>Casual</option><option>Contract</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-sector-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Sector</label>
                    <select id={`ei-emp-sector-${sid}-${emp.id}`} className={inputCls}>
                      <option>Select...</option><option>Public</option><option>Private</option>
                    </select>
                  </div>

                  <div className="hidden md:block" />

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-company-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Name</label>
                    <input id={`ei-emp-company-${sid}-${emp.id}`} className={inputCls} type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-address-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Company Address</label>
                    <input id={`ei-emp-address-${sid}-${emp.id}`} className={inputCls} type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor={`ei-emp-occupation-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Occupation Role</label>
                    <input id={`ei-emp-occupation-${sid}-${emp.id}`} className={inputCls} type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-start-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start Date with Company</label>
                    <input
                      id={`ei-emp-start-${sid}-${emp.id}`}
                      className={inputCls}
                      type="date"
                      max={new Date().toISOString().split("T")[0]}
                      value={emp.startDate}
                      onChange={e => updateEmploymentDate(emp.id, e.target.value)}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-gross-income-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gross Annual Income</label>
                    <CurrencyInput id={`ei-gross-income-${sid}-${emp.id}`} />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-contact-name-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Employer Contact Name</label>
                    <input id={`ei-emp-contact-name-${sid}-${emp.id}`} className={inputCls} type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor={`ei-emp-contact-number-${sid}-${emp.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Employer Contact Number</label>
                    <input id={`ei-emp-contact-number-${sid}-${emp.id}`} className={inputCls} type="tel" />
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
                    Lenders require a minimum of 3 years continuous employment history. Because your
                    earliest stated start date is within the last 3 years, please provide previous employment details.
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
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-base-salary-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Base Salary</label>
                <CurrencyInput id={`ei-base-salary-${sid}`} value={income.baseSalary} onChange={v => setIncome("baseSalary", v)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-income-freq-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Income Frequency</label>
                <select id={`ei-income-freq-${sid}`} value={income.incomeFrequency} onChange={e => setIncome("incomeFrequency", e.target.value)} className={inputCls}>
                  <option value="">Select...</option>
                  <option>Weekly</option><option>Fortnightly</option><option>Monthly</option><option>Yearly</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-overtime-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Overtime</label>
                <CurrencyInput id={`ei-overtime-${sid}`} value={income.overtime} onChange={v => setIncome("overtime", v)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-commission-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Commission / Bonuses</label>
                <CurrencyInput id={`ei-commission-${sid}`} value={income.commission} onChange={v => setIncome("commission", v)} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor={`ei-allowances-amount-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Regular Allowances</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrencyInput id={`ei-allowances-amount-${sid}`} placeholder="Amount" value={income.allowancesAmount} onChange={v => setIncome("allowancesAmount", v)} />
                  <input id={`ei-allowances-type-${sid}`} className={inputCls} type="text" placeholder="Type (e.g. Car)"
                    value={income.allowancesType} onChange={e => setIncome("allowancesType", e.target.value)} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-rental-existing-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Existing Rental Income</label>
                <CurrencyInput id={`ei-rental-existing-${sid}`} value={income.rentalExisting} onChange={v => setIncome("rentalExisting", v)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-rental-proposed-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Proposed Rental Income</label>
                <CurrencyInput id={`ei-rental-proposed-${sid}`} value={income.rentalProposed} onChange={v => setIncome("rentalProposed", v)} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`ei-investment-income-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Investment Income (e.g. Share Dividends)</label>
                <CurrencyInput id={`ei-investment-income-${sid}`} value={income.investmentIncome} onChange={v => setIncome("investmentIncome", v)} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor={`ei-govt-amount-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Government Payments</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <CurrencyInput id={`ei-govt-amount-${sid}`} placeholder="Amount" value={income.govtAmount} onChange={v => setIncome("govtAmount", v)} />
                  <select id={`ei-govt-type-${sid}`} value={income.govtType} onChange={e => setIncome("govtType", e.target.value)} className={inputCls}>
                    <option value="">Select Type...</option>
                    <option>Family</option><option>Pension</option><option>Carer&apos;s</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Self-Employed — only when at least one employment record is Self-Employed */}
      {hasSelfEmployed && (
        <div className="mb-12">
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
            <div className="flex items-center gap-3 px-6 py-4 bg-primary">
              <span className="material-symbols-outlined text-white text-[20px]">storefront</span>
              <h2 className="font-bold text-white uppercase tracking-wider text-base">Self-Employed Applicants</h2>
            </div>
            <div className="p-4 sm:p-6 md:p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor={`ei-business-name-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Business Name</label>
                  <input id={`ei-business-name-${sid}`} className={inputCls} type="text" value={se.businessName} onChange={e => setSE("businessName", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-entity-type-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type of Entity</label>
                  <input id={`ei-entity-type-${sid}`} className={inputCls} type="text" value={se.entityType} onChange={e => setSE("entityType", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-trustee-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Trustee (if applicable)</label>
                  <input id={`ei-trustee-${sid}`} className={inputCls} type="text" value={se.trustee} onChange={e => setSE("trustee", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5 md:col-span-2">
                  <label htmlFor={`ei-beneficiaries-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Beneficiaries</label>
                  <input id={`ei-beneficiaries-${sid}`} className={inputCls} type="text" value={se.beneficiaries} onChange={e => setSE("beneficiaries", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-website-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Website</label>
                  <input id={`ei-website-${sid}`} className={inputCls} type="url" placeholder="https://" value={se.website} onChange={e => setSE("website", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-abn-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">ABN / ACN</label>
                  <input id={`ei-abn-${sid}`} className={inputCls} type="text" value={se.abnAcn} onChange={e => setSE("abnAcn", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-industry-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Industry</label>
                  <input id={`ei-industry-${sid}`} className={inputCls} type="text" value={se.industry} onChange={e => setSE("industry", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-net-current-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Current FY)</label>
                  <CurrencyInput id={`ei-net-current-${sid}`} value={se.netProfitCurrent} onChange={v => setSE("netProfitCurrent", v)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-net-prev-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Net Profit (Previous FY)</label>
                  <CurrencyInput id={`ei-net-prev-${sid}`} value={se.netProfitPrevious} onChange={v => setSE("netProfitPrevious", v)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-addbacks-current-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Current FY)</label>
                  <CurrencyInput id={`ei-addbacks-current-${sid}`} value={se.addBacksCurrent} onChange={v => setSE("addBacksCurrent", v)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-addbacks-prev-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Add Backs (Previous FY)</label>
                  <CurrencyInput id={`ei-addbacks-prev-${sid}`} value={se.addBacksPrevious} onChange={v => setSE("addBacksPrevious", v)} />
                </div>

                <div className="col-span-full pt-4 pb-2 border-b border-slate-200 dark:border-slate-700">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Accountant Details</h4>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-accountant-name-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name</label>
                  <input id={`ei-accountant-name-${sid}`} className={inputCls} type="text" value={se.accountantName} onChange={e => setSE("accountantName", e.target.value)} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`ei-accountant-phone-${sid}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
                  <input id={`ei-accountant-phone-${sid}`} className={inputCls} type="tel" value={se.accountantPhone} onChange={e => setSE("accountantPhone", e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="sticky bottom-0 z-10 mt-12 flex items-center justify-between border-t border-primary/10 bg-background-light py-4 dark:bg-background-dark md:static md:pt-8 md:pb-0 md:bg-transparent dark:md:bg-transparent">
        <Link href="/personal-details" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="hidden sm:block text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">Save Draft</span>
          <Link href="/assets" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
            Next Step
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </div>

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

"use client";

import { PageShell } from "@/components/PageShell";
import { CurrencyInput } from "@/components/CurrencyInput";
import Link from "next/link";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────
type YesNo = "" | "yes" | "no";
type YesNoNA = "" | "yes" | "no" | "na";
type YesNoNotSure = "" | "yes" | "no" | "not-sure";

interface LiabilityDef {
  id: string;
  label: string;
  subLabel?: string;
  bsbHint?: string;
}

interface LiabilityData {
  bsb: string;
  acct: string;
  lender: string;
  limit: string;
  amountOwing: string;
  monthlyRepayment: string;
  clearing: YesNo;
  rate: string;
  remainingTerm: string;
  ownerApp1: boolean;
  ownerApp2: boolean;
}

const EMPTY_LIABILITY: LiabilityData = {
  bsb: "", acct: "", lender: "", limit: "", amountOwing: "",
  monthlyRepayment: "", clearing: "", rate: "", remainingTerm: "",
  ownerApp1: false, ownerApp2: false,
};

const LIABILITY_DEFS: LiabilityDef[] = [
  { id: "mortgage-1",    label: "Mortgage 1",    subLabel: "Property #_____" },
  { id: "mortgage-2",    label: "Mortgage 2",    subLabel: "Property #_____" },
  { id: "mortgage-3",    label: "Mortgage 3",    subLabel: "Property #_____" },
  { id: "mortgage-4",    label: "Mortgage 4",    subLabel: "Property #_____" },
  { id: "mortgage-5",    label: "Mortgage 5",    subLabel: "Property #_____" },
  { id: "personal-loan", label: "Personal Loan" },
  { id: "car-finance-1", label: "Car Finance 1" },
  { id: "car-finance-2", label: "Car Finance 2" },
  { id: "credit-card-1", label: "Credit Card 1", bsbHint: "Last 4 digits" },
  { id: "credit-card-2", label: "Credit Card 2", bsbHint: "Last 4 digits" },
  { id: "credit-card-3", label: "Credit Card 3", bsbHint: "Last 4 digits" },
  { id: "hecs-help",     label: "HECS / HELP" },
  { id: "other-1",       label: "Other" },
  { id: "other-2",       label: "Other" },
  { id: "other-3",       label: "Other" },
];

const CREDIT_QUESTIONS = [
  { field: "defaults"   as const, label: "Have you ever had any defaults, financial judgments, or legal proceedings against you?" },
  { field: "difficulty" as const, label: "Are you having difficulty meeting your financial commitments?" },
  { field: "arrears"    as const, label: "Are any existing debts currently in arrears?" },
];

const INSURANCE_QUESTIONS = [
  { key: "reviewedInsurance", label: "Have you reviewed your personal risk insurance requirements in the last 12 months?" },
  { key: "sufficientLife",    label: "Do you have sufficient life insurance to cover, as a minimum, your existing and proposed debts?" },
  { key: "incomeProtection",  label: "If your income reduces, due to illness or injury, do you have the insurance to cover your loan?" },
];

const INSURANCE_SUB_QUESTIONS = [
  { key: "homeBuilding",  label: "Home building and contents" },
  { key: "motorVehicle",  label: "Motor vehicle" },
  { key: "landlord",      label: "Landlord protection" },
  { key: "boatCaravan",   label: "Boat or caravan" },
  { key: "commercial",    label: "Commercial insurance" },
];

// ── Shared sub-components ────────────────────────────────────────────────
function RadioGroup({ name, value, onChange, options }: {
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="accent-primary"
          />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

function InsuranceQuestion({ label, name, value, onChange, bold }: {
  label: string;
  name: string;
  value: YesNoNotSure;
  onChange: (v: YesNoNotSure) => void;
  bold?: boolean;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span className={`text-sm text-slate-700 dark:text-slate-300 flex-1 ${bold ? "font-semibold" : ""}`}>
        {label}
      </span>
      <div className="flex items-center gap-5 shrink-0">
        {(["yes", "no", "not-sure"] as const).map(opt => (
          <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
            <input
              type="radio"
              name={name}
              value={opt}
              checked={value === opt}
              onChange={() => onChange(opt)}
              className="accent-primary"
            />
            {opt === "yes" ? "Yes" : opt === "no" ? "No" : "Not Sure"}
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function LiabilitiesPage() {
  // Liability table
  const [liabilities, setLiabilities] = useState<Record<string, LiabilityData>>({});

  const getLiability = (id: string): LiabilityData => ({
    ...EMPTY_LIABILITY, ...liabilities[id],
  });

  const updateLiability = (id: string, field: keyof LiabilityData, value: string | boolean) => {
    setLiabilities(prev => ({
      ...prev,
      [id]: { ...EMPTY_LIABILITY, ...prev[id], [field]: value },
    }));
  };

  // Other Items
  const [retirementApp1, setRetirementApp1] = useState("75");
  const [retirementApp2, setRetirementApp2] = useState("75");
  const [exitStrategy, setExitStrategy] = useState("");

  // Credit History
  const [creditHistory, setCreditHistory] = useState<{
    defaults:   [YesNoNA, YesNoNA];
    difficulty: [YesNoNA, YesNoNA];
    arrears:    [YesNoNA, YesNoNA];
    details: string;
  }>({
    defaults:   ["", ""],
    difficulty: ["", ""],
    arrears:    ["", ""],
    details: "",
  });

  const updateCredit = (field: "defaults" | "difficulty" | "arrears", idx: 0 | 1, value: YesNoNA) => {
    setCreditHistory(prev => {
      const next = [...prev[field]] as [YesNoNA, YesNoNA];
      next[idx] = value;
      return { ...prev, [field]: next };
    });
  };

  // Insurance / Lifestyle
  const [insurance, setInsurance] = useState<Record<string, YesNoNotSure>>({});
  const updateInsurance = (key: string, value: YesNoNotSure) =>
    setInsurance(prev => ({ ...prev, [key]: value }));

  // Shared table cell input style
  const cellInput = "w-full rounded border-slate-300 text-xs px-2 py-1.5 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary";

  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 5 of 6
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
          Liabilities
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please provide details of all current loans, credit cards, and other financial commitments.
        </p>
      </header>

      {/* ── Current Liabilities ─────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">credit_card</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Current Liabilities</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-36">Liability</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-20">BSB</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-20">Acct.</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-28">Lender</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-24">Limit</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-24">Amount Owing</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-24">Monthly Repayment</th>
                  <th className="text-center px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-[88px]">Clearing / Refinance</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-16">% Rate</th>
                  <th className="text-left px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-28">Remaining Term / Expiry</th>
                  <th className="text-center px-2 py-3 font-semibold text-slate-600 dark:text-slate-300 text-xs w-20">Ownership</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {LIABILITY_DEFS.map((def) => {
                  const row = getLiability(def.id);
                  return (
                    <tr key={def.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      {/* Liability label */}
                      <td className="px-4 py-2">
                        <div className="font-semibold text-slate-800 dark:text-slate-200 text-xs">{def.label}</div>
                        {def.subLabel && <div className="text-slate-400 text-[10px] mt-0.5">{def.subLabel}</div>}
                      </td>

                      {/* BSB */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          placeholder={def.bsbHint ?? ""}
                          value={row.bsb}
                          onChange={e => updateLiability(def.id, "bsb", e.target.value)}
                          className={cellInput}
                        />
                      </td>

                      {/* Account */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={row.acct}
                          onChange={e => updateLiability(def.id, "acct", e.target.value)}
                          className={cellInput}
                        />
                      </td>

                      {/* Lender */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          value={row.lender}
                          onChange={e => updateLiability(def.id, "lender", e.target.value)}
                          className={cellInput}
                        />
                      </td>

                      {/* Limit */}
                      <td className="px-2 py-2">
                        <CurrencyInput
                          value={row.limit}
                          onChange={v => updateLiability(def.id, "limit", v)}
                          className="text-xs"
                        />
                      </td>

                      {/* Amount Owing */}
                      <td className="px-2 py-2">
                        <CurrencyInput
                          value={row.amountOwing}
                          onChange={v => updateLiability(def.id, "amountOwing", v)}
                          className="text-xs"
                        />
                      </td>

                      {/* Monthly Repayment */}
                      <td className="px-2 py-2">
                        <CurrencyInput
                          value={row.monthlyRepayment}
                          onChange={v => updateLiability(def.id, "monthlyRepayment", v)}
                          className="text-xs"
                        />
                      </td>

                      {/* Clearing / Refinance */}
                      <td className="px-2 py-2">
                        <RadioGroup
                          name={`clearing-${def.id}`}
                          value={row.clearing}
                          onChange={v => updateLiability(def.id, "clearing", v)}
                          options={[
                            { label: "Yes", value: "yes" },
                            { label: "No",  value: "no"  },
                          ]}
                        />
                      </td>

                      {/* % Rate */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          placeholder="%"
                          value={row.rate}
                          onChange={e => updateLiability(def.id, "rate", e.target.value)}
                          className={cellInput}
                        />
                      </td>

                      {/* Remaining Term */}
                      <td className="px-2 py-2">
                        <input
                          type="text"
                          placeholder="e.g. 24 months"
                          value={row.remainingTerm}
                          onChange={e => updateLiability(def.id, "remainingTerm", e.target.value)}
                          className={cellInput}
                        />
                      </td>

                      {/* Ownership */}
                      <td className="px-2 py-2">
                        <div className="flex flex-col gap-1">
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={row.ownerApp1}
                              onChange={e => updateLiability(def.id, "ownerApp1", e.target.checked)}
                              className="accent-primary"
                            />
                            App 1
                          </label>
                          <label className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={row.ownerApp2}
                              onChange={e => updateLiability(def.id, "ownerApp2", e.target.checked)}
                              className="accent-primary"
                            />
                            App 2
                          </label>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Other Items ─────────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">list_alt</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Other Items</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="li-retirement-app1" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Expected Retirement Age — Applicant 1
                </label>
                <input
                  id="li-retirement-app1"
                  type="number"
                  min={40}
                  max={99}
                  value={retirementApp1}
                  onChange={e => setRetirementApp1(e.target.value)}
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="li-retirement-app2" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Expected Retirement Age — Applicant 2
                </label>
                <input
                  id="li-retirement-app2"
                  type="number"
                  min={40}
                  max={99}
                  value={retirementApp2}
                  onChange={e => setRetirementApp2(e.target.value)}
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="li-exit-strategy" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Exit Strategy
              </label>
              <textarea
                id="li-exit-strategy"
                rows={3}
                value={exitStrategy}
                onChange={e => setExitStrategy(e.target.value)}
                placeholder="Describe the borrower's planned exit strategy…"
                className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Credit History ──────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">history</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Credit History</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px]">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left pb-3 pr-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Question</th>
                    <th className="pb-3 px-8 font-semibold text-slate-700 dark:text-slate-300 text-sm text-center">Applicant 1</th>
                    <th className="pb-3 px-8 font-semibold text-slate-700 dark:text-slate-300 text-sm text-center">Applicant 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {CREDIT_QUESTIONS.map(q => (
                    <tr key={q.field}>
                      <td className="py-4 pr-6 text-sm text-slate-700 dark:text-slate-300 leading-snug">{q.label}</td>
                      <td className="py-4 px-8">
                        <RadioGroup
                          name={`credit-${q.field}-app1`}
                          value={creditHistory[q.field][0]}
                          onChange={v => updateCredit(q.field, 0, v as YesNoNA)}
                          options={[
                            { label: "Yes", value: "yes" },
                            { label: "No",  value: "no"  },
                            { label: "N/A", value: "na"  },
                          ]}
                        />
                      </td>
                      <td className="py-4 px-8">
                        <RadioGroup
                          name={`credit-${q.field}-app2`}
                          value={creditHistory[q.field][1]}
                          onChange={v => updateCredit(q.field, 1, v as YesNoNA)}
                          options={[
                            { label: "Yes", value: "yes" },
                            { label: "No",  value: "no"  },
                            { label: "N/A", value: "na"  },
                          ]}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-1.5">
              <label htmlFor="li-credit-details" className="text-sm font-semibold italic text-slate-600 dark:text-slate-400">
                If yes to any of the above, please provide further details
              </label>
              <textarea
                id="li-credit-details"
                rows={3}
                value={creditHistory.details}
                onChange={e => setCreditHistory(prev => ({ ...prev, details: e.target.value }))}
                className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Protecting Lifestyle and Assets ─────────────────────────────── */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">security</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Protecting Lifestyle and Assets</h2>
          </div>
          <div className="p-6 md:p-8 space-y-5">
            {INSURANCE_QUESTIONS.map(q => (
              <InsuranceQuestion
                key={q.key}
                label={q.label}
                name={q.key}
                value={(insurance[q.key] ?? "") as YesNoNotSure}
                onChange={v => updateInsurance(q.key, v)}
              />
            ))}

            {/* Sub-questions */}
            <div className="pt-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Are you sure your existing insurance is adequate for:
              </p>
              <div className="ml-5 space-y-3 border-l-2 border-slate-100 dark:border-slate-700 pl-4">
                {INSURANCE_SUB_QUESTIONS.map(q => (
                  <InsuranceQuestion
                    key={q.key}
                    label={q.label}
                    name={q.key}
                    value={(insurance[q.key] ?? "") as YesNoNotSure}
                    onChange={v => updateInsurance(q.key, v)}
                  />
                ))}
              </div>
            </div>

            <InsuranceQuestion
              label="I wish to pursue a free and non-obligation consultation to discuss my insurance needs (Allianz)"
              name="allianz"
              value={(insurance.allianz ?? "") as YesNoNotSure}
              onChange={v => updateInsurance("allianz", v)}
            />
            <InsuranceQuestion
              label="I wish to pursue a free and non-obligation consultation to discuss my home connection needs, such as internet, electricity, gas, etc. (Smart Select)"
              name="smartSelect"
              value={(insurance.smartSelect ?? "") as YesNoNotSure}
              onChange={v => updateInsurance("smartSelect", v)}
            />
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
        <Link
          href="/assets"
          className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <div className="flex items-center gap-6">
          <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">
            Save Draft
          </span>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90"
          >
            Next Step
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </button>
        </div>
      </div>

      {/* ── Need Help ───────────────────────────────────────────────────── */}
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

"use client";

import { PageShell } from "@/components/PageShell";
import { CurrencyInput } from "@/components/CurrencyInput";
import Link from "next/link";
import { useState, useMemo } from "react";

// ── Expense definitions (matches the fact-find form exactly) ─────────────
interface ExpenseDef {
  id: string;
  label: string;
  description: string;
  excludes?: string;   // rendered as "Excluding …" in italic beneath description
}

const EXPENSES: ExpenseDef[] = [
  {
    id: "board",
    label: "Board",
    description: "Ongoing board commitments post-settlement.",
  },
  {
    id: "child-care",
    label: "Child Care",
    description: "Childcare, including nannies.",
  },
  {
    id: "child-maintenance",
    label: "Child Maintenance",
    description: "Child and/or spousal maintenance costs.",
  },
  {
    id: "clothing",
    label: "Clothing & Personal Care",
    description: "Clothing, footwear, cosmetics, personal care.",
  },
  {
    id: "entertainment",
    label: "Entertainment",
    description:
      "Entertainment costs including alcohol, tobacco, gambling, restaurants, membership fees and holidays.",
  },
  {
    id: "groceries",
    label: "Groceries",
    description: "Groceries including food and toiletries.",
    excludes: "alcohol & tobacco",
  },
  {
    id: "health-care",
    label: "Health Care",
    description: "Medical and health costs.",
    excludes: "Insurance",
  },
  {
    id: "higher-education",
    label: "Higher Education & Vocational Training",
    description: "Tertiary education fees and textbooks.",
    excludes: "HECS & HELP (refer Liabilities)",
  },
  {
    id: "holiday-home",
    label: "Holiday Home Costs",
    description: "Costs associated with any secondary residences.",
  },
  {
    id: "home-vehicle-insurance",
    label: "Home & Vehicle Insurance",
    description:
      "Insurance costs such as personal belongings, travel and ambulance insurance, home and content, building and any compulsory insurance of motor vehicles (combined insurance and registration) other than recreation vehicles.",
  },
  {
    id: "home-maintenance",
    label: "Home Maintenance & Utilities",
    description:
      "Housing and property expenses on owner occupied property including rates, levies, repairs and maintenance, other household items and utilities.",
    excludes:
      "land tax, body corporate and strata fees, telephone, internet, pay TV and insurances.",
  },
  {
    id: "investment-property",
    label: "Investment Property Costs",
    description:
      "All costs associated with an 'Investment Property' including building/contents insurance, rates, taxes, levies, body corporate, strata fees, repairs, maintenance.",
  },
  {
    id: "medical-life-insurance",
    label: "Medical & Life Insurance",
    description:
      "Hospital, medical and dental health insurance, sickness and personal accident insurance, life insurance.",
  },
  {
    id: "other",
    label: "Other",
    description: "Other Regular and Recurring Expenses.",
  },
  {
    id: "other-insurances",
    label: "Other Insurances",
    description:
      "Insurance of recreational vehicles such as motorcycle, caravan, trailer, boat, and aircraft including combined insurance and registration.",
  },
  {
    id: "pet-care",
    label: "Pet Care",
    description: "Expenses related to pet care.",
  },
  {
    id: "private-education",
    label: "Private & Non-Government Education",
    description: "Private/Non-Government school fees/uniforms and textbooks.",
  },
  {
    id: "public-education",
    label: "Public Primary & Secondary Education",
    description: "Public or Secondary school fees/uniforms and textbooks.",
  },
  {
    id: "rental-expenses",
    label: "Rental Expenses",
    description: "Ongoing rent commitments post-settlement.",
  },
  {
    id: "strata-land-tax",
    label: "Strata Fees & Land Tax",
    description: "Land Tax, Body Corporate and Strata Fees on O/O Property.",
  },
  {
    id: "telephone-internet",
    label: "Telephone & Internet",
    description:
      "Telephone accounts (home and mobile), internet, pay TV and media streaming subscriptions (such as Netflix, Apple Music and Spotify).",
  },
  {
    id: "vehicle-transport",
    label: "Vehicle Maintenance & Transport",
    description:
      "Public transport, motor vehicle running costs including fuel, servicing, registration, parking, and tolls.",
  },
];

// ── State ─────────────────────────────────────────────────────────────────
type ExpenseRow = string; // post-settlement amount only

function parse(val: string): number {
  const n = parseFloat(val.replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

function formatTotal(n: number): string {
  if (n === 0) return "$0";
  return `$${n.toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ── Column input width ────────────────────────────────────────────────────
const COL = "w-36 sm:w-44";

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════
export default function LivingExpensesPage() {
  const [rows, setRows] = useState<Record<string, ExpenseRow>>({});

  const getRow = (id: string): ExpenseRow => rows[id] ?? "";

  const total = useMemo(
    () => EXPENSES.reduce((acc, item) => acc + parse(rows[item.id] ?? ""), 0),
    [rows]
  );

  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 6 of 6
        </span>
        <h1 className="mb-4 text-3xl md:text-4xl font-extrabold text-primary dark:text-slate-100">
          Living Expenses
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          Enter the household&apos;s expected monthly living expenses post-settlement.
          Leave fields blank if the category does not apply.
        </p>
      </header>

      {/* ── Expenses table ──────────────────────────────────────────────── */}
      <div className="mb-12 bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">

        {/* Table header */}
        <div className="flex items-center bg-primary px-4 sm:px-6 py-4 gap-4">
          <span className="material-symbols-outlined text-white text-[20px]">account_balance_wallet</span>
          <h2 className="font-bold text-white uppercase tracking-wider text-base flex-1">
            Monthly Living Expenses
          </h2>
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {EXPENSES.map((item, i) => (
            <div
              key={item.id}
              className={`flex items-center gap-3 px-4 sm:px-6 py-4 transition-colors ${
                i % 2 !== 0 ? "bg-slate-50/60 dark:bg-slate-700/20" : ""
              }`}
            >
              {/* Label + description */}
              <div className="flex-1 min-w-0 pr-2">
                <p className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">
                  {item.label}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                  {item.description}
                </p>
                {item.excludes && (
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 italic">
                    <span className="font-semibold not-italic">Excluding</span> {item.excludes}
                  </p>
                )}
              </div>

              {/* Input */}
              <div className={`${COL} shrink-0`}>
                <CurrencyInput
                  value={getRow(item.id)}
                  onChange={v => setRows(prev => ({ ...prev, [item.id]: v }))}
                  aria-label={`${item.label} — post-settlement`}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Total row */}
        <div className="flex items-center gap-3 px-4 sm:px-6 py-5 bg-primary/5 dark:bg-primary/10 border-t-2 border-primary/20">
          <div className="flex-1 font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider text-sm">
            Total Monthly Expenses
          </div>
          <div className={`${COL} shrink-0 flex items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 px-3 py-2.5`}>
            <span className="font-bold text-primary dark:text-white text-sm">
              {formatTotal(total)}
            </span>
          </div>
        </div>
      </div>

      {/* Need Help — mobile only (above nav) */}
      <div className="mt-3 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700 md:hidden">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you&apos;re unsure about any details, you can save your progress and return later.
              Your mortgage broker will review all information during your consultation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      {/* Mobile */}
      <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-3 bg-background-light py-4 dark:bg-background-dark md:hidden">
        <button type="button" className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-emerald-700">
          <span className="material-symbols-outlined text-[20px]">check_circle</span>
          Submit Fact Find
        </button>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/liabilities" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Previous Step
          </Link>
          <button type="button" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Save Draft
          </button>
        </div>
      </div>
      {/* Desktop */}
      <div className="mt-12 hidden items-center justify-between border-t border-primary/10 pt-8 md:flex">
        <Link
          href="/liabilities"
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
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-emerald-700"
          >
            <span className="material-symbols-outlined text-[20px]">check_circle</span>
            Submit Fact Find
          </button>
        </div>
      </div>

      <div className="mt-8 hidden bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700 md:block">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you&apos;re unsure about any details, you can save your progress and return later.
              Your mortgage broker will review all information during your consultation.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

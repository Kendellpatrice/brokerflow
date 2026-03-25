"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { BrokerShell } from "@/components/BrokerShell";
import { db } from "@/lib/firestore";
import { doc, getDoc, updateDoc, deleteField, serverTimestamp, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import { createAndSendInvite } from "@/lib/invite";

// ── Constants ─────────────────────────────────────────────────────────────────

const LOAN_PURPOSES = [
  { value: "purchase", label: "Purchase", icon: "home" },
  { value: "refinance", label: "Refinance", icon: "currency_exchange" },
  { value: "equity_release", label: "Equity Release", icon: "account_balance_wallet" },
  { value: "other", label: "Other", icon: "more_horiz" },
];

const EXPENSE_LABELS: Record<string, string> = {
  board: "Board",
  "child-care": "Child Care",
  "child-maintenance": "Child Maintenance",
  clothing: "Clothing",
  entertainment: "Entertainment",
  groceries: "Groceries",
  "health-care": "Health Care",
  "higher-education": "Higher Education",
  "holiday-home": "Holiday Home",
  "home-vehicle-insurance": "Home & Vehicle Insurance",
  "home-maintenance": "Home Maintenance",
  "investment-property": "Investment Property",
  "medical-life-insurance": "Medical & Life Insurance",
  other: "Other",
  "other-insurances": "Other Insurances",
  "pet-care": "Pet Care",
  "private-education": "Private Education",
  "public-education": "Public Education",
  "rental-expenses": "Rental Expenses",
  "strata-land-tax": "Strata & Land Tax",
  "telephone-internet": "Telephone & Internet",
  "vehicle-transport": "Vehicle & Transport",
};

// ── Style constants ────────────────────────────────────────────────────────────

const inputBase =
  "w-full rounded-lg border bg-white py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-slate-100 sm:py-2.5 sm:text-sm";
const inputNormal = "border-slate-300 focus:border-primary dark:border-slate-600";
const inputError = "border-red-400 focus:border-red-400";

// ── Helper components ──────────────────────────────────────────────────────────

function SectionBadge({ n }: { n: number }) {
  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">
      {n}
    </span>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
      <span className="material-symbols-outlined text-[14px]">error</span>
      {message}
    </p>
  );
}

// ── Fact Find review helper components ────────────────────────────────────────

function ReviewSection({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-3 bg-primary px-5 py-3.5">
        <span className="material-symbols-outlined text-[20px] text-white">{icon}</span>
        <span className="font-bold text-white">{title}</span>
      </div>
      <div className="p-8 md:p-10">{children}</div>
    </div>
  );
}

function KvRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (!value && value !== 0) return null;
  const strVal = typeof value === "string" ? value.trim() : null;
  if (strVal === "" || strVal === null && typeof value !== "number") return null;
  return (
    <div className="py-2.5">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-0.5 text-sm text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}

function EmptyState({ message = "None recorded" }: { message?: string }) {
  return <p className="py-4 text-center text-sm italic text-slate-400">{message}</p>;
}

// ── Currency helpers ───────────────────────────────────────────────────────────

function parseCurrency(v: unknown): number {
  if (typeof v !== "string" && typeof v !== "number") return 0;
  const n = parseFloat(String(v).replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000) {
    return "$" + (n / 1_000_000).toFixed(1) + "M";
  }
  return "$" + n.toLocaleString("en-AU", { maximumFractionDigits: 0 });
}

function CurrencyDisplay({ value }: { value: unknown }) {
  const n = parseCurrency(value);
  if (n === 0) return <span className="text-slate-400">—</span>;
  return <span className="font-bold">{formatCurrency(n)}</span>;
}

// ── Annualise income ───────────────────────────────────────────────────────────

function annualise(amount: number, freq: string): number {
  switch (freq) {
    case "Weekly": return amount * 52;
    case "Fortnightly": return amount * 26;
    case "Monthly": return amount * 12;
    case "Yearly": return amount;
    default: return amount;
  }
}

// ── Firestore data types (loose) ──────────────────────────────────────────────

type RawDoc = Record<string, unknown>;

interface Applicant {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  isPrimary: boolean;
}

// ── Financial Summary cards ────────────────────────────────────────────────────

function FinancialSummary({ data }: { data: RawDoc }) {
  const applicants = (data.applicants as Applicant[] | undefined) ?? [];
  const employment = (data.employment as Record<string, RawDoc> | undefined) ?? {};
  const assets = (data.assets as RawDoc | undefined) ?? {};
  const liabilities = (data.liabilities as RawDoc | undefined) ?? {};
  const livingExpenses = (data.livingExpenses as Record<string, string> | undefined) ?? {};

  // Total annual income
  let totalIncome = 0;
  for (const app of applicants) {
    const empData = employment[app.id] as RawDoc | undefined;
    if (!empData) continue;
    const income = (empData.income as RawDoc | undefined) ?? {};
    const base = parseCurrency(income.baseSalary);
    const freq = String(income.incomeFrequency ?? "Yearly");
    totalIncome += annualise(base, freq);
    totalIncome += parseCurrency(income.overtime) * 52;
    totalIncome += parseCurrency(income.commission);
    totalIncome += parseCurrency(income.investmentIncome);
  }

  // Total assets
  let totalAssets = 0;
  const props = (assets.properties as RawDoc[] | undefined) ?? [];
  for (const p of props) totalAssets += parseCurrency(p.estimatedValue);
  const bankAccounts = (assets.bankAccounts as RawDoc[] | undefined) ?? [];
  for (const b of bankAccounts) totalAssets += parseCurrency(b.balance);
  const vehicles = (assets.vehicles as RawDoc[] | undefined) ?? [];
  for (const v of vehicles) totalAssets += parseCurrency(v.estimatedValue);
  const superFunds = (assets.superFunds as RawDoc[] | undefined) ?? [];
  for (const s of superFunds) totalAssets += parseCurrency(s.balance);
  const otherAssets = (assets.otherAssets as RawDoc[] | undefined) ?? [];
  for (const o of otherAssets) totalAssets += parseCurrency(o.value);

  // Total liabilities
  let totalLiabilities = 0;
  const mortgages = (liabilities.mortgages as RawDoc[] | undefined) ?? [];
  const personalLoans = (liabilities.personalLoans as RawDoc[] | undefined) ?? [];
  const creditCards = (liabilities.creditCards as RawDoc[] | undefined) ?? [];
  const otherLiab = (liabilities.otherLiabilities as RawDoc[] | undefined) ?? [];
  for (const l of [...mortgages, ...personalLoans, ...creditCards, ...otherLiab]) {
    totalLiabilities += parseCurrency(l.amountOwing);
  }

  // Monthly expenses
  let totalExpenses = 0;
  for (const v of Object.values(livingExpenses)) {
    totalExpenses += parseCurrency(v);
  }

  const metrics = [
    { label: "Total Annual Income", value: totalIncome, icon: "payments" },
    { label: "Total Assets", value: totalAssets, icon: "account_balance" },
    { label: "Total Liabilities", value: totalLiabilities, icon: "credit_card" },
    { label: "Monthly Expenses", value: totalExpenses, icon: "receipt_long" },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {metrics.map((m) => (
        <div
          key={m.label}
          className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
        >
          <div className="mb-2 flex size-9 items-center justify-center rounded-lg bg-primary/10">
            <span className="material-symbols-outlined text-[20px] text-primary">{m.icon}</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white">{formatCurrency(m.value)}</p>
          <p className="mt-0.5 text-xs text-slate-500">{m.label}</p>
        </div>
      ))}
    </div>
  );
}

// ── Applicants section ─────────────────────────────────────────────────────────

function ApplicantsSection({ applicants }: { applicants: Applicant[] }) {
  if (!applicants.length) return <EmptyState />;
  return (
    <div className="flex flex-col gap-3">
      {applicants.map((app) => (
        <div
          key={app.id}
          className="flex items-center justify-between rounded-lg border border-slate-100 p-3 dark:border-slate-800"
        >
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-white">
                {app.firstName} {app.lastName}
              </p>
              <p className="text-xs text-slate-500">{app.role}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {app.isPrimary && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary">
                Primary
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Personal Details section ───────────────────────────────────────────────────

function PersonalDetailsSection({
  applicants,
  personalDetails,
}: {
  applicants: Applicant[];
  personalDetails: Record<string, RawDoc>;
}) {
  if (!applicants.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      {applicants.map((app) => {
        const pd = personalDetails[app.id] ?? {};
        const hasAny = Object.values(pd).some((v) => v !== "" && v !== undefined && v !== null);
        return (
          <div key={app.id}>
            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
              {app.firstName} {app.lastName}
            </p>
            {!hasAny ? (
              <EmptyState message="No personal details submitted" />
            ) : (
              <div className="space-y-4">
                {/* Applicant Details */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Applicant Details
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    <KvRow label="Title" value={pd.title as string} />
                    <KvRow label="Given Names" value={pd.givenNames as string} />
                    <KvRow label="Surname" value={pd.surname as string} />
                    <KvRow label="Preferred Name" value={pd.preferredName as string} />
                    <KvRow label="Date of Birth" value={pd.dob as string} />
                    <KvRow label="Town of Birth" value={pd.townOfBirth as string} />
                    <KvRow label="Marital Status" value={pd.maritalStatus as string} />
                    <KvRow label="Gender" value={pd.gender as string} />
                    <KvRow label="Permanent Resident" value={pd.permanentResident ? "Yes" : pd.permanentResident === false ? "No" : undefined} />
                    <KvRow label="Visa Type" value={pd.visaType as string} />
                    <KvRow label="Driver's Licence No." value={pd.licenceNumber as string} />
                    <KvRow label="Licence State" value={pd.licenceState as string} />
                    <KvRow label="Licence Expiry" value={pd.licenceExpiry as string} />
                    <KvRow label="Dependent Ages" value={pd.dependentAges as string} />
                    <KvRow label="Mother's Maiden Name" value={pd.mothersMaidenName as string} />
                  </div>
                </div>
                {/* Contact */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    <KvRow label="Email" value={pd.email as string} />
                    <KvRow label="Mobile" value={pd.mobilePhone as string} />
                    <KvRow label="Home Phone" value={pd.homePhone as string} />
                    <KvRow label="Work Phone" value={pd.workPhone as string} />
                  </div>
                </div>
                {/* Address */}
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Address
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    <KvRow label="Address" value={pd.addressFinder as string} />
                    <KvRow label="Suburb" value={pd.suburb as string} />
                    <KvRow label="State" value={pd.state as string} />
                    <KvRow label="Postcode" value={pd.postcode as string} />
                    <KvRow label="Address Status" value={pd.addressStatus as string} />
                    <KvRow label="Residing Since" value={pd.addressStartDate as string} />
                    <KvRow label="Previous Address" value={pd.prevAddress as string} />
                    <KvRow label="Prev Address From" value={pd.prevAddressFrom as string} />
                    <KvRow label="Prev Address To" value={pd.prevAddressTo as string} />
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Employment & Income section ────────────────────────────────────────────────

function EmploymentSection({
  applicants,
  employment,
}: {
  applicants: Applicant[];
  employment: Record<string, RawDoc>;
}) {
  if (!applicants.length) return <EmptyState />;

  return (
    <div className="space-y-6">
      {applicants.map((app) => {
        const empData = employment[app.id] ?? {};
        const employments = (empData.employments as RawDoc[] | undefined) ?? [];
        const income = (empData.income as RawDoc | undefined) ?? {};
        const selfEmployed = (empData.selfEmployed as RawDoc | undefined) ?? {};
        const hasSelfEmployed = !!selfEmployed.businessName && String(selfEmployed.businessName).trim() !== "";

        return (
          <div key={app.id}>
            <p className="mb-3 text-sm font-bold text-slate-700 dark:text-slate-300">
              {app.firstName} {app.lastName}
            </p>

            {/* Employment records */}
            {employments.length > 0 && (
              <div className="mb-4">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Employment Records
                </p>
                <div className="flex flex-wrap gap-2">
                  {employments.map((emp, i) => (
                    <div
                      key={String(emp.id ?? i)}
                      className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs dark:border-slate-800 dark:bg-slate-800/50"
                    >
                      <p className="font-semibold text-slate-700 dark:text-slate-300">{String(emp.type ?? "—")}</p>
                      <p className="text-slate-500">{String(emp.startDate ?? "—")}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Income */}
            <div className="mb-4">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Income</p>
              <div className="grid grid-cols-2 gap-x-6">
                <KvRow label="Base Salary" value={income.baseSalary ? <CurrencyDisplay value={income.baseSalary} /> : null} />
                <KvRow label="Frequency" value={income.incomeFrequency as string} />
                <KvRow label="Overtime" value={income.overtime ? <CurrencyDisplay value={income.overtime} /> : null} />
                <KvRow label="Commission" value={income.commission ? <CurrencyDisplay value={income.commission} /> : null} />
                <KvRow label="Allowances" value={income.allowancesAmount ? <><CurrencyDisplay value={income.allowancesAmount} />{income.allowancesType ? <span className="ml-1 text-slate-500">({income.allowancesType as string})</span> : null}</> : null} />
                <KvRow label="Rental (Existing)" value={income.rentalExisting ? <CurrencyDisplay value={income.rentalExisting} /> : null} />
                <KvRow label="Rental (Proposed)" value={income.rentalProposed ? <CurrencyDisplay value={income.rentalProposed} /> : null} />
                <KvRow label="Investment Income" value={income.investmentIncome ? <CurrencyDisplay value={income.investmentIncome} /> : null} />
                <KvRow label="Government Payment" value={income.govtAmount ? <><CurrencyDisplay value={income.govtAmount} />{income.govtType ? <span className="ml-1 text-slate-500">({income.govtType as string})</span> : null}</> : null} />
              </div>
            </div>

            {/* Self Employed */}
            {hasSelfEmployed && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Self-Employment Details
                </p>
                <div className="grid grid-cols-2 gap-x-6">
                  <KvRow label="Business Name" value={selfEmployed.businessName as string} />
                  <KvRow label="Entity Type" value={selfEmployed.entityType as string} />
                  <KvRow label="Trustee" value={selfEmployed.trustee as string} />
                  <KvRow label="Beneficiaries" value={selfEmployed.beneficiaries as string} />
                  <KvRow label="Website" value={selfEmployed.website as string} />
                  <KvRow label="ABN / ACN" value={selfEmployed.abnAcn as string} />
                  <KvRow label="Industry" value={selfEmployed.industry as string} />
                  <KvRow label="Net Profit (Current)" value={selfEmployed.netProfitCurrent ? <CurrencyDisplay value={selfEmployed.netProfitCurrent} /> : null} />
                  <KvRow label="Net Profit (Previous)" value={selfEmployed.netProfitPrevious ? <CurrencyDisplay value={selfEmployed.netProfitPrevious} /> : null} />
                  <KvRow label="Add-backs (Current)" value={selfEmployed.addBacksCurrent ? <CurrencyDisplay value={selfEmployed.addBacksCurrent} /> : null} />
                  <KvRow label="Add-backs (Previous)" value={selfEmployed.addBacksPrevious ? <CurrencyDisplay value={selfEmployed.addBacksPrevious} /> : null} />
                  <KvRow label="Accountant" value={selfEmployed.accountantName as string} />
                  <KvRow label="Accountant Phone" value={selfEmployed.accountantPhone as string} />
                </div>
              </div>
            )}

            {!employments.length && !Object.values(income).some((v) => v) && !hasSelfEmployed && (
              <EmptyState message="No employment data submitted" />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Assets section ─────────────────────────────────────────────────────────────

function AssetsSection({ assets }: { assets: RawDoc }) {
  const properties = (assets.properties as RawDoc[] | undefined) ?? [];
  const bankAccounts = (assets.bankAccounts as RawDoc[] | undefined) ?? [];
  const vehicles = (assets.vehicles as RawDoc[] | undefined) ?? [];
  const superFunds = (assets.superFunds as RawDoc[] | undefined) ?? [];
  const otherAssets = (assets.otherAssets as RawDoc[] | undefined) ?? [];

  const hasAny = properties.length || bankAccounts.length || vehicles.length || superFunds.length || otherAssets.length;
  if (!hasAny) return <EmptyState />;

  return (
    <div className="space-y-6">
      {/* Properties */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Properties</p>
        {properties.length === 0 ? (
          <EmptyState message="None recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left">Address</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-right">Est. Value</th>
                  <th className="px-3 py-2 text-right">Rental Income</th>
                  <th className="px-3 py-2 text-left">Lender</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {properties.map((p, i) => (
                  <tr key={i} className="dark:text-slate-300">
                    <td className="px-3 py-2">{String(p.address ?? "—")}</td>
                    <td className="px-3 py-2">{String(p.propertyType ?? "—")}</td>
                    <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={p.estimatedValue} /></td>
                    <td className="px-3 py-2 text-right"><CurrencyDisplay value={p.rentalIncome} /></td>
                    <td className="px-3 py-2">{String(p.lender ?? "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Bank Accounts */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Bank Accounts</p>
        {bankAccounts.length === 0 ? (
          <EmptyState message="None recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left">Institution</th>
                  <th className="px-3 py-2 text-left">Type</th>
                  <th className="px-3 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {bankAccounts.map((b, i) => (
                  <tr key={i} className="dark:text-slate-300">
                    <td className="px-3 py-2">{String(b.institution ?? "—")}</td>
                    <td className="px-3 py-2">{String(b.accountType ?? "—")}</td>
                    <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={b.balance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Vehicles */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Vehicles</p>
        {vehicles.length === 0 ? (
          <EmptyState message="None recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left">Make / Model</th>
                  <th className="px-3 py-2 text-left">Year</th>
                  <th className="px-3 py-2 text-right">Est. Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {vehicles.map((v, i) => (
                  <tr key={i} className="dark:text-slate-300">
                    <td className="px-3 py-2">{String(v.makeModel ?? "—")}</td>
                    <td className="px-3 py-2">{String(v.year ?? "—")}</td>
                    <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={v.estimatedValue} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Super Funds */}
      <div>
        <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Superannuation</p>
        {superFunds.length === 0 ? (
          <EmptyState message="None recorded" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left">Fund Name</th>
                  <th className="px-3 py-2 text-left">Member Number</th>
                  <th className="px-3 py-2 text-right">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {superFunds.map((s, i) => (
                  <tr key={i} className="dark:text-slate-300">
                    <td className="px-3 py-2">{String(s.fundName ?? "—")}</td>
                    <td className="px-3 py-2">{String(s.memberNumber ?? "—")}</td>
                    <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={s.balance} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Other Assets */}
      {otherAssets.length > 0 && (
        <div>
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">Other Assets</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                  <th className="px-3 py-2 text-left">Description</th>
                  <th className="px-3 py-2 text-right">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {otherAssets.map((o, i) => (
                  <tr key={i} className="dark:text-slate-300">
                    <td className="px-3 py-2">{String(o.description ?? "—")}</td>
                    <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={o.value} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Liabilities section ────────────────────────────────────────────────────────

function LiabilityTable({
  label,
  rows,
}: {
  label: string;
  rows: RawDoc[];
}) {
  const total = rows.reduce((s, r) => s + parseCurrency(r.amountOwing), 0);
  const totalRepayment = rows.reduce((s, r) => s + parseCurrency(r.monthlyRepayment), 0);

  return (
    <div>
      <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      {rows.length === 0 ? (
        <EmptyState message="None recorded" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
                <th className="px-3 py-2 text-left">Lender</th>
                <th className="px-3 py-2 text-right">Amount Owing</th>
                <th className="px-3 py-2 text-right">Monthly Repayment</th>
                <th className="px-3 py-2 text-left">Clearing</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {rows.map((r, i) => (
                <tr key={i} className="dark:text-slate-300">
                  <td className="px-3 py-2">{String(r.lender ?? r.description ?? "—")}</td>
                  <td className="px-3 py-2 text-right font-bold"><CurrencyDisplay value={r.amountOwing} /></td>
                  <td className="px-3 py-2 text-right"><CurrencyDisplay value={r.monthlyRepayment} /></td>
                  <td className="px-3 py-2">{r.clearing ? "Yes" : "No"}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold dark:bg-slate-800/50">
                <td className="px-3 py-2 text-xs uppercase tracking-wider text-slate-500">Total</td>
                <td className="px-3 py-2 text-right text-slate-900 dark:text-white">{formatCurrency(total)}</td>
                <td className="px-3 py-2 text-right text-slate-900 dark:text-white">{formatCurrency(totalRepayment)}</td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function LiabilitiesSection({ liabilities }: { liabilities: RawDoc }) {
  const mortgages = (liabilities.mortgages as RawDoc[] | undefined) ?? [];
  const personalLoans = (liabilities.personalLoans as RawDoc[] | undefined) ?? [];
  const creditCards = (liabilities.creditCards as RawDoc[] | undefined) ?? [];
  const otherLiab = (liabilities.otherLiabilities as RawDoc[] | undefined) ?? [];

  return (
    <div className="space-y-6">
      <LiabilityTable label="Mortgages" rows={mortgages} />
      <LiabilityTable label="Personal Loans" rows={personalLoans} />
      <LiabilityTable label="Credit Cards" rows={creditCards} />
      <LiabilityTable label="Other Liabilities" rows={otherLiab} />
    </div>
  );
}

// ── Living Expenses section ────────────────────────────────────────────────────

function LivingExpensesSection({ livingExpenses }: { livingExpenses: Record<string, string> }) {
  const entries = Object.entries(livingExpenses).filter(([, v]) => parseCurrency(v) > 0);
  const total = entries.reduce((s, [, v]) => s + parseCurrency(v), 0);

  if (entries.length === 0) return <EmptyState />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-slate-50 text-xs font-bold uppercase text-slate-500 dark:bg-slate-800/50">
            <th className="px-3 py-2 text-left">Expense</th>
            <th className="px-3 py-2 text-right">Monthly Amount</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {entries.map(([id, v]) => (
            <tr key={id} className="dark:text-slate-300">
              <td className="px-3 py-2">{EXPENSE_LABELS[id] ?? id}</td>
              <td className="px-3 py-2 text-right font-bold">{formatCurrency(parseCurrency(v))}</td>
            </tr>
          ))}
          <tr className="bg-slate-50 font-bold dark:bg-slate-800/50">
            <td className="px-3 py-2 text-xs uppercase tracking-wider text-slate-500">Total</td>
            <td className="px-3 py-2 text-right text-slate-900 dark:text-white">{formatCurrency(total)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// ── Fact Find Review tab ───────────────────────────────────────────────────────

function FactFindReview({ data }: { data: RawDoc }) {
  const applicants = (data.applicants as Applicant[] | undefined) ?? [];
  const personalDetails = (data.personalDetails as Record<string, RawDoc> | undefined) ?? {};
  const employment = (data.employment as Record<string, RawDoc> | undefined) ?? {};
  const assets = (data.assets as RawDoc | undefined) ?? {};
  const liabilities = (data.liabilities as RawDoc | undefined) ?? {};
  const livingExpenses = (data.livingExpenses as Record<string, string> | undefined) ?? {};

  const submittedAt = data.factFindSubmittedAt as Timestamp | null | undefined;
  const submittedDate = submittedAt
    ? submittedAt.toDate?.().toLocaleDateString("en-AU", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : null;

  return (
    <div className="space-y-5">
      {/* Submitted banner */}
      {submittedDate && (
        <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-3 dark:border-emerald-800 dark:bg-emerald-900/20">
          <span className="material-symbols-outlined text-[18px] text-emerald-600 dark:text-emerald-400">task_alt</span>
          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
            Submitted on <span className="font-bold">{submittedDate}</span>
          </p>
        </div>
      )}

      {/* A. Financial Summary */}
      <div>
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-slate-400">Financial Summary</p>
        <FinancialSummary data={data} />
      </div>

      {/* B. Applicants */}
      <ReviewSection icon="people" title="Applicants">
        <ApplicantsSection applicants={applicants} />
      </ReviewSection>

      {/* C. Personal Details */}
      <ReviewSection icon="badge" title="Personal Details">
        <PersonalDetailsSection applicants={applicants} personalDetails={personalDetails} />
      </ReviewSection>

      {/* D. Employment & Income */}
      <ReviewSection icon="work" title="Employment & Income">
        <EmploymentSection applicants={applicants} employment={employment} />
      </ReviewSection>

      {/* E. Assets */}
      <ReviewSection icon="account_balance" title="Assets">
        <AssetsSection assets={assets} />
      </ReviewSection>

      {/* F. Liabilities */}
      <ReviewSection icon="credit_card" title="Liabilities">
        <LiabilitiesSection liabilities={liabilities} />
      </ReviewSection>

      {/* G. Living Expenses */}
      <ReviewSection icon="receipt_long" title="Living Expenses">
        <LivingExpensesSection livingExpenses={livingExpenses} />
      </ReviewSection>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function EditLeadPage() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams<{ leadId: string }>();
  const leadId = params.leadId;
  const chipInputRef = useRef<HTMLInputElement>(null);

  const [fetchState, setFetchState] = useState<"loading" | "ready" | "notfound">("loading");
  const [rawDoc, setRawDoc] = useState<RawDoc>({});
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    loanPurpose: "",
    loanPurposeOther: "",
    loanAmount: "",
    notes: "",
  });
  const [chips, setChips] = useState<string[]>([]);
  const [chipInput, setChipInput] = useState("");
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "factfind">("details");
  const [resending, setResending] = useState(false);
  const [sentInvite, setSentInvite] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  // ── Load existing lead data ──────────────────────────────────────────────────

  useEffect(() => {
    getDoc(doc(db, "brokerLeads", leadId)).then((snap) => {
      if (!snap.exists()) {
        setFetchState("notfound");
        return;
      }
      const d = snap.data() as RawDoc;
      setRawDoc(d);
      setForm({
        fullName: (d.fullName as string) ?? "",
        phone: (d.phone as string) ?? "",
        email: (d.email as string) ?? "",
        loanPurpose: (d.loanPurpose as string) ?? "",
        loanPurposeOther: (d.loanPurposeOther as string) ?? "",
        loanAmount: (d.loanAmount as string) ?? "",
        notes: (d.notes as string) ?? "",
      });
      setChips(Array.isArray(d.referredBy) ? (d.referredBy as string[]) : []);
      // Default to fact find tab when submitted
      if (d.factFindStatus === "submitted") {
        setActiveTab("factfind");
      }
      setFetchState("ready");
    });
  }, [leadId]);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: "" }));
    };

  const addChip = (raw: string) => {
    const value = raw.trim();
    if (value && !chips.includes(value)) setChips((prev) => [...prev, value]);
    setChipInput("");
  };

  const removeChip = (chip: string) => setChips((prev) => prev.filter((c) => c !== chip));

  const handleChipKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(chipInput);
    } else if (e.key === "Backspace" && !chipInput && chips.length > 0) {
      setChips((prev) => prev.slice(0, -1));
    }
  };

  const togglePurpose = (value: string) =>
    setForm((f) => ({
      ...f,
      loanPurpose: f.loanPurpose === value ? "" : value,
      loanPurposeOther: value === "other" ? f.loanPurposeOther : "",
    }));

  const validate = () => {
    const next: Partial<typeof form> = {};
    if (!form.fullName.trim()) next.fullName = "Full name is required.";
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    if (!form.email.trim()) {
      next.email = "Email address is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    return next;
  };

  // ── Invite actions ────────────────────────────────────────────────────────────

  const handleResend = async () => {
    setResending(true);
    try {
      await createAndSendInvite({
        brokerId: user?.uid,
        leadId,
        leadName: rawDoc.fullName as string,
        leadEmail: rawDoc.email as string,
        leadRef: rawDoc.ref as string | undefined,
        previousToken: rawDoc.activeInviteToken as string | undefined,
      });
      setRawDoc((prev) => ({ ...prev, activeInviteToken: "sent" }));
      setSentInvite(true);
      setTimeout(() => setSentInvite(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send invitation.");
    } finally {
      setResending(false);
    }
  };

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await updateDoc(doc(db, "brokerLeads", leadId), { factFindStatus: deleteField() });
      setRawDoc((prev) => {
        const next = { ...prev };
        delete next.factFindStatus;
        return next;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unlock fact find.");
    } finally {
      setUnlocking(false);
    }
  };

  // ── Save ──────────────────────────────────────────────────────────────────────

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "brokerLeads", leadId), {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
        loanPurpose: form.loanPurpose,
        loanPurposeOther: form.loanPurposeOther,
        loanAmount: form.loanAmount,
        notes: form.notes,
        referredBy: chips,
        updatedAt: serverTimestamp(),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setErrors({ fullName: "Failed to save changes. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  // ── Header ────────────────────────────────────────────────────────────────────

  const isSubmitted = rawDoc.factFindStatus === "submitted";

  const headerRight = (
    <Link
      href="/broker/leads"
      className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary"
    >
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      <span className="hidden sm:inline">Back to Leads</span>
    </Link>
  );

  // ── Not found ─────────────────────────────────────────────────────────────────

  if (fetchState === "notfound") {
    return (
      <BrokerShell title="Edit Lead" activeHref="/broker/leads" headerRight={headerRight}>
        <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
            <span className="material-symbols-outlined text-[28px] text-slate-400">person_off</span>
          </div>
          <div>
            <p className="font-semibold text-slate-700 dark:text-slate-300">Lead not found</p>
            <p className="mt-1 text-sm text-slate-500">This lead may have been deleted.</p>
          </div>
          <Link
            href="/broker/leads"
            className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Back to Leads
          </Link>
        </div>
      </BrokerShell>
    );
  }

  return (
    <BrokerShell title="Lead Details" activeHref="/broker/leads" headerRight={headerRight}>

      {/* Success toast */}
      {saved && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-lg dark:bg-slate-700">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
          Changes saved
        </div>
      )}

      <div className="p-6 md:p-10">
        <div className="mx-auto max-w-7xl">

          {/* ── Profile header ──────────────────────────────────────────────── */}
          <div className="mb-6">
            <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

              {/* Left: avatar + info */}
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
                    {form.fullName ? form.fullName.charAt(0).toUpperCase() : "?"}
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 size-3 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-900" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white sm:text-2xl">
                    {fetchState === "loading" ? (
                      <span className="inline-block h-7 w-48 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
                    ) : (
                      form.fullName || "Lead Details"
                    )}
                  </h1>
                  <div className="mt-1 flex flex-col gap-y-0.5 text-sm text-slate-500">
                    {form.email && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">mail</span>
                        {form.email}
                      </span>
                    )}
                    {form.phone && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">phone</span>
                        {form.phone}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-slate-400">
                    {isSubmitted ? "Fact Find Submitted" : rawDoc.activeInviteToken ? "Invitation Sent" : "New Lead"}
                    {!!rawDoc.createdAt && (
                      <> · Registered {(rawDoc.createdAt as Timestamp).toDate().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</>
                    )}
                  </p>
                </div>
              </div>

              {/* Right: action buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                {isSubmitted && (
                  <button
                    type="button"
                    onClick={handleUnlock}
                    disabled={unlocking}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
                  >
                    {unlocking ? (
                      <><span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>Unlocking…</>
                    ) : (
                      <><span className="material-symbols-outlined text-[14px]">lock_open</span>Unlock</>
                    )}
                  </button>
                )}
                {!isSubmitted && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resending}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    {resending ? (
                      <><span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>Sending…</>
                    ) : sentInvite ? (
                      <><span className="material-symbols-outlined text-[14px]">mark_email_read</span>Sent</>
                    ) : (
                      <><span className="material-symbols-outlined text-[14px]">outgoing_mail</span>{rawDoc.activeInviteToken ? "Resend Invite" : "Send Invite"}</>
                    )}
                  </button>
                )}
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[14px]">mail</span>
                  Send Email
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                  <span className="material-symbols-outlined text-[14px]">upload_file</span>
                  Upload Document
                </button>
                <button type="button" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition hover:bg-primary/90">
                  <span className="material-symbols-outlined text-[14px]">note_add</span>
                  New Application
                </button>
              </div>
            </div>

            {/* Pill tabs */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={[
                  "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition",
                  activeTab === "details"
                    ? "bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-primary"
                    : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                ].join(" ")}
              >
                <span className="material-symbols-outlined text-[16px]">edit</span>
                Details
              </button>
              {isSubmitted && (
                <button
                  type="button"
                  onClick={() => setActiveTab("factfind")}
                  className={[
                    "flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-sm font-semibold transition",
                    activeTab === "factfind"
                      ? "bg-white text-primary shadow-sm dark:bg-slate-900 dark:text-primary"
                      : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200",
                  ].join(" ")}
                >
                  <span className="material-symbols-outlined text-[16px]">fact_check</span>
                  Fact Find
                </button>
              )}
            </div>
          </div>

          {/* ── Tab content ────────────────────────────────────────────────── */}

          {activeTab === "factfind" && isSubmitted ? (
            <FactFindReview data={rawDoc} />
          ) : (
            <>
              {/* Loan volume stat card */}
              <div className="mb-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">Total Loan Volume</p>
                  <span className="material-symbols-outlined text-[22px] text-slate-300 dark:text-slate-600">payments</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
                  {form.loanAmount
                    ? `$${Number(form.loanAmount.replace(/,/g, "")).toLocaleString("en-AU")}`
                    : "$0"}
                </p>
              </div>

            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

              {fetchState === "loading" ? (
                <div className="flex items-center justify-center py-20">
                  <span className="material-symbols-outlined animate-spin text-[28px] text-slate-400">progress_activity</span>
                </div>
              ) : (
                <form onSubmit={handleSave} noValidate>

                  {/* ── Section 1: Contact Details ──────────────────────────── */}
                  <div className="space-y-5 p-8 md:p-10">
                    <div className="flex items-center justify-between">
                      <div className="flex cursor-default items-center gap-2">
                        <SectionBadge n={1} />
                        <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Details</h4>
                      </div>
                      <span className="text-xs text-slate-400"><span className="text-red-400">*</span> Required fields</span>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={form.fullName}
                        onChange={set("fullName")}
                        placeholder="Jane Smith"
                        autoComplete="name"
                        className={`${inputBase} px-3.5 ${errors.fullName ? inputError : inputNormal}`}
                      />
                      <FieldError message={errors.fullName} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">phone</span>
                        <input
                          type="tel"
                          value={form.phone}
                          onChange={set("phone")}
                          placeholder="+61 4XX XXX XXX"
                          autoComplete="tel"
                          className={`${inputBase} pl-10 pr-3.5 ${errors.phone ? inputError : inputNormal}`}
                        />
                      </div>
                      <FieldError message={errors.phone} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">mail</span>
                        <input
                          type="email"
                          value={form.email}
                          onChange={set("email")}
                          placeholder="jane@example.com"
                          autoComplete="email"
                          className={`${inputBase} pl-10 pr-3.5 ${errors.email ? inputError : inputNormal}`}
                        />
                      </div>
                      <FieldError message={errors.email} />
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Referred by
                        <span className="ml-1.5 text-xs font-normal text-slate-400">optional · press Enter or comma to add</span>
                      </label>
                      <div
                        onClick={() => chipInputRef.current?.focus()}
                        className="flex min-h-11 cursor-text flex-wrap items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 dark:border-slate-600 dark:bg-slate-800"
                      >
                        {chips.map((chip) => (
                          <span
                            key={chip}
                            className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                          >
                            {chip}
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); removeChip(chip); }}
                              className="ml-0.5 text-primary/60 hover:text-primary"
                              aria-label={`Remove ${chip}`}
                            >
                              <span className="material-symbols-outlined text-[14px]">close</span>
                            </button>
                          </span>
                        ))}
                        <input
                          ref={chipInputRef}
                          type="text"
                          value={chipInput}
                          onChange={(e) => setChipInput(e.target.value)}
                          onKeyDown={handleChipKeyDown}
                          onBlur={() => addChip(chipInput)}
                          placeholder={chips.length === 0 ? "e.g. John Doe, Ray White" : ""}
                          className="min-w-30 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 dark:text-slate-100"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ── Section 2: Loan Details ─────────────────────────────── */}
                  <div className="space-y-5 border-t border-slate-100 p-8 dark:border-slate-800 md:p-10">
                    <div className="flex cursor-default items-center gap-2">
                      <SectionBadge n={2} />
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loan Details</h4>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Loan purpose
                      </label>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                        {LOAN_PURPOSES.map(({ value, label, icon }) => {
                          const selected = form.loanPurpose === value;
                          return (
                            <button
                              key={value}
                              type="button"
                              onClick={() => togglePurpose(value)}
                              className={[
                                "relative flex cursor-pointer flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition sm:py-4",
                                selected
                                  ? "border-primary bg-primary/5 text-primary"
                                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400 dark:hover:border-slate-600",
                              ].join(" ")}
                            >
                              {selected && (
                                <span className="material-symbols-outlined absolute right-2 top-2 text-[14px] text-primary">
                                  check_circle
                                </span>
                              )}
                              <span className={`material-symbols-outlined text-[22px] ${selected ? "text-primary" : "text-slate-400"}`}>
                                {icon}
                              </span>
                              <span className="text-xs font-semibold leading-tight">{label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {form.loanPurpose === "other" && (
                        <div className="mt-3">
                          <input
                            type="text"
                            value={form.loanPurposeOther}
                            onChange={set("loanPurposeOther")}
                            placeholder="Describe the loan purpose…"
                            autoFocus
                            className={`${inputBase} px-3.5 ${inputNormal}`}
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Estimated loan amount
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">$</span>
                        <input
                          type="text"
                          inputMode="numeric"
                          value={form.loanAmount}
                          onChange={(e) => {
                            const raw = e.target.value.replace(/[^0-9]/g, "");
                            const formatted = raw ? Number(raw).toLocaleString("en-AU") : "";
                            setForm((f) => ({ ...f, loanAmount: formatted }));
                          }}
                          placeholder="500,000"
                          className={`${inputBase} pl-7 pr-3.5 ${inputNormal}`}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-slate-400">Enter the full loan value in AUD.</p>
                    </div>
                  </div>

                  {/* ── Section 3: Additional Details ──────────────────────── */}
                  <div className="space-y-5 border-t border-slate-100 p-8 dark:border-slate-800 md:p-10">
                    <div className="flex cursor-default items-center gap-2">
                      <SectionBadge n={3} />
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Additional Details</h4>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Notes
                        <span className="ml-1.5 text-xs font-normal text-slate-400">optional</span>
                      </label>
                      <textarea
                        value={form.notes}
                        onChange={set("notes")}
                        placeholder="Add any relevant notes about this lead…"
                        rows={4}
                        className="w-full resize-none rounded-lg border border-slate-300 bg-white px-3.5 py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 sm:text-sm"
                      />
                      <p className="mt-1.5 text-right text-xs text-slate-400">{form.notes.length} characters</p>
                    </div>
                  </div>

                  {/* ── Footer actions ──────────────────────────────────────── */}
                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:justify-end md:p-6">
                    <Link
                      href="/broker/leads"
                      className="flex w-full cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto sm:py-2.5"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:py-2.5"
                    >
                      {saving ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                          Saving…
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">save</span>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>

                </form>
              )}
            </div>
          </>
          )}
        </div>
      </div>
    </BrokerShell>
  );
}

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BrokerShell } from "@/components/BrokerShell";

const LOAN_PURPOSES = [
  { value: "purchase", label: "Purchase", icon: "home" },
  { value: "refinance", label: "Refinance", icon: "currency_exchange" },
  { value: "equity_release", label: "Equity Release", icon: "account_balance_wallet" },
  { value: "other", label: "Other", icon: "more_horiz" },
];

const inputBase =
  "w-full rounded-lg border bg-white py-3 text-base text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-slate-100 sm:py-2.5 sm:text-sm";
const inputNormal = "border-slate-300 focus:border-primary dark:border-slate-600";
const inputError = "border-red-400 focus:border-red-400";

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

export default function NewLeadPage() {
  const router = useRouter();
  const chipInputRef = useRef<HTMLInputElement>(null);

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
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);

  const isDirty =
    Object.values(form).some((v) => v.trim() !== "") || chips.length > 0;

  const set =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
      setErrors((err) => ({ ...err, [field]: "" }));
    };

  // ── Chip handlers ──────────────────────────────────────────────────────────

  const addChip = (raw: string) => {
    const value = raw.trim();
    if (value && !chips.includes(value)) {
      setChips((prev) => [...prev, value]);
    }
    setChipInput("");
  };

  const removeChip = (chip: string) =>
    setChips((prev) => prev.filter((c) => c !== chip));

  const handleChipKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addChip(chipInput);
    } else if (e.key === "Backspace" && !chipInput && chips.length > 0) {
      setChips((prev) => prev.slice(0, -1));
    }
  };

  // ── Loan purpose toggle ────────────────────────────────────────────────────

  const togglePurpose = (value: string) =>
    setForm((f) => ({
      ...f,
      loanPurpose: f.loanPurpose === value ? "" : value,
      loanPurposeOther: value === "other" ? f.loanPurposeOther : "",
    }));

  // ── Validation ─────────────────────────────────────────────────────────────

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

  // ── Submit ─────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setShowSuccess(true);
    setTimeout(() => router.push("/broker"), 1800);
  };

  // ── Cancel ─────────────────────────────────────────────────────────────────

  const handleCancel = () => {
    if (isDirty) {
      setConfirmCancel(true);
    } else {
      router.push("/broker");
    }
  };

  // ── Header ─────────────────────────────────────────────────────────────────

  const headerRight = (
    <Link
      href="/broker"
      className="flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-primary"
    >
      <span className="material-symbols-outlined text-[18px]">arrow_back</span>
      <span className="hidden sm:inline">Back to Dashboard</span>
    </Link>
  );

  return (
    <BrokerShell title="Add New Lead" headerRight={headerRight}>

      {/* ── Success toast ──────────────────────────────────────────────────── */}
      {showSuccess && (
        <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2.5 rounded-xl bg-slate-900 px-5 py-3.5 text-sm font-medium text-white shadow-lg dark:bg-slate-700">
          <span className="material-symbols-outlined text-[20px] text-emerald-400">check_circle</span>
          Lead saved successfully! Redirecting…
        </div>
      )}

      <div className="p-4 md:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">

            {/* Card header */}
            <div className="border-b border-slate-100 p-5 dark:border-slate-800 md:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <span className="material-symbols-outlined">person_add</span>
                </div>
                <div>
                  <h3 className="font-bold md:text-lg">New Lead</h3>
                  <p className="text-xs text-slate-500">Fill in the details below to add a new lead.</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} noValidate>

              {/* ── Section 1: Contact Details ────────────────────────────── */}
              <div className="space-y-5 p-5 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SectionBadge n={1} />
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Details</h4>
                  </div>
                  <span className="text-xs text-slate-400"><span className="text-red-400">*</span> Required fields</span>
                </div>

                {/* Full name */}
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

                {/* Phone */}
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

                {/* Email */}
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

                {/* Referred by — chip input */}
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

              {/* ── Section 2: Loan Details ───────────────────────────────── */}
              <div className="space-y-5 border-t border-slate-100 p-5 dark:border-slate-800 md:p-6">
                <div className="flex items-center gap-2">
                  <SectionBadge n={2} />
                  <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Loan Details</h4>
                </div>

                {/* Loan Purpose — tiles */}
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
                            "relative flex flex-col items-center gap-1.5 rounded-lg border px-2 py-3 text-center transition sm:py-4",
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

                {/* Estimated Loan Amount */}
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

              {/* ── Section 3: Additional Details ─────────────────────────── */}
              <div className="space-y-5 border-t border-slate-100 p-5 dark:border-slate-800 md:p-6">
                <div className="flex items-center gap-2">
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

              {/* ── Cancel confirmation banner ────────────────────────────── */}
              {confirmCancel && (
                <div className="mx-5 mb-5 flex flex-col gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-900/20 sm:flex-row sm:items-center sm:justify-between md:mx-6">
                  <div className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined mt-0.5 shrink-0 text-[18px] text-amber-600">warning</span>
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      You have unsaved changes. Are you sure you want to leave?
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => setConfirmCancel(false)}
                      className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                    >
                      Keep editing
                    </button>
                    <Link
                      href="/broker"
                      className="rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-700"
                    >
                      Discard & leave
                    </Link>
                  </div>
                </div>
              )}

              {/* ── Footer actions ────────────────────────────────────────── */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 p-5 dark:border-slate-800 sm:flex-row sm:justify-end md:p-6">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 sm:w-auto sm:py-2.5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60 sm:w-auto sm:py-2.5"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                      Saving…
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[18px]">save</span>
                      Save Lead
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </BrokerShell>
  );
}

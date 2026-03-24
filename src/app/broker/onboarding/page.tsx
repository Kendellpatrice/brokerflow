"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { createOrgAndProfile, useBrokerProfile } from "@/context/brokerProfile";

const inputBase =
  "w-full rounded-lg border bg-white py-3 px-3.5 text-base text-slate-900 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800 dark:text-slate-100 sm:py-2.5 sm:text-sm";
const inputNormal = "border-slate-300 focus:border-primary dark:border-slate-600";
const inputError = "border-red-400 focus:border-red-400";

export default function BrokerOnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { reload } = useBrokerProfile();

  const [orgName, setOrgName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [errors, setErrors] = useState<{ orgName?: string; displayName?: string }>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!orgName.trim()) errs.orgName = "Organisation name is required.";
    if (!displayName.trim()) errs.displayName = "Your name is required.";
    if (Object.keys(errs).length) { setErrors(errs); return; }
    if (!user) return;

    setLoading(true);
    try {
      await createOrgAndProfile({ uid: user.uid, orgName: orgName.trim(), displayName: displayName.trim() });
      reload();
      router.replace("/broker");
    } catch {
      setErrors({ orgName: "Failed to create organisation. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background-light p-4 dark:bg-background-dark">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-primary text-white">
            <span className="material-symbols-outlined text-[28px]">account_balance</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Set up your organisation</h1>
          <p className="mt-2 text-sm text-slate-500">This only takes a moment. You can update these details later.</p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <form onSubmit={handleSubmit} noValidate className="space-y-5 p-6">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Organisation name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => { setOrgName(e.target.value); setErrors((err) => ({ ...err, orgName: "" })); }}
                placeholder="e.g. AU Mortgage Solutions"
                autoFocus
                className={`${inputBase} ${errors.orgName ? inputError : inputNormal}`}
              />
              {errors.orgName && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.orgName}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300">
                Your name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => { setDisplayName(e.target.value); setErrors((err) => ({ ...err, displayName: "" })); }}
                placeholder="e.g. Sarah Chen"
                autoComplete="name"
                className={`${inputBase} ${errors.displayName ? inputError : inputNormal}`}
              />
              {errors.displayName && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <span className="material-symbols-outlined text-[14px]">error</span>
                  {errors.displayName}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                  Setting up…
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  Continue
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

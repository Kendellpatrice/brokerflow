"use client";

import { Applicant } from "@/context/applicants";

export type CompletionStatus = "complete" | "partial" | "empty";

interface ApplicantTabsProps {
  applicants: Applicant[];
  activeId: string;
  onSelect: (id: string) => void;
  completionMap?: Record<string, CompletionStatus>;
}

function initials(a: Applicant) {
  const f = a.firstName.trim()[0] ?? "";
  const l = a.lastName.trim()[0] ?? "";
  return (f + l).toUpperCase() || "?";
}

function CompletionDot({ status }: { status: CompletionStatus }) {
  if (status === "complete")
    return (
      <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500 text-white shrink-0">
        <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>
          check
        </span>
      </span>
    );
  if (status === "partial")
    return <span className="size-2.5 rounded-full bg-amber-400 shrink-0 animate-pulse" />;
  return null;
}

export function ApplicantTabs({ applicants, activeId, onSelect, completionMap = {} }: ApplicantTabsProps) {
  // Single applicant — render nothing, caller shows form directly
  if (applicants.length <= 1) return null;

  return (
    <div className="mb-8 flex flex-wrap gap-3" role="tablist" aria-label="Select applicant">
      {applicants.map((a, i) => {
        const isActive = a.id === activeId;
        const status = completionMap[a.id] ?? "empty";
        const label = [a.firstName, a.lastName].filter(Boolean).join(" ") || `Applicant ${i + 1}`;

        return (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(a.id)}
            className={`flex flex-1 min-w-0 items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all ${
              isActive
                ? "border-primary bg-primary text-white shadow-md"
                : "border-slate-200 bg-white text-slate-700 hover:border-primary/50 hover:bg-primary/5 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-primary/10 text-primary dark:bg-primary/20"
              }`}
            >
              {initials(a) !== "?" ? initials(a) : (
                <span className="material-symbols-outlined text-[18px]">person</span>
              )}
            </div>

            {/* Name + role */}
            <div className="min-w-0">
              <p className={`truncate text-sm font-bold leading-tight ${isActive ? "text-white" : "text-slate-800 dark:text-slate-100"}`}>
                {label}
              </p>
              <p className={`text-xs leading-tight mt-0.5 ${isActive ? "text-white/70" : "text-slate-500 dark:text-slate-400"}`}>
                {a.role}
              </p>
            </div>

            {/* Completion dot */}
            {!isActive && <CompletionDot status={status} />}
            {isActive && status === "complete" && (
              <span className="flex size-5 items-center justify-center rounded-full bg-white/20 text-white shrink-0">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>check</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import { ReactNode, useState } from "react";

interface CollapsibleSectionProps {
  icon: string;
  title: string;
  badge?: string;
  defaultOpen?: boolean;
  optional?: boolean;
  children: ReactNode;
}

export function CollapsibleSection({
  icon,
  title,
  badge,
  defaultOpen = false,
  optional = false,
  children,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between px-4 sm:px-6 py-4 bg-primary hover:bg-primary/90 transition-colors text-left group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="material-symbols-outlined text-white text-[20px] shrink-0">{icon}</span>
          <h2 className="font-bold text-white uppercase tracking-wider text-base sm:truncate">{title}</h2>
          {optional && (
            <span className="text-white/70 text-xs italic font-normal normal-case tracking-normal">
              (if known)
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {badge && !isOpen && (
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white">
              {badge}
            </span>
          )}
          <span
            className={`material-symbols-outlined text-white text-[22px] transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          >
            expand_more
          </span>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? "max-h-[9999px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

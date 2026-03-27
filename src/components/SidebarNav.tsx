"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useLeadData } from "@/context/lead";

export function SidebarNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { leadData } = useLeadData();
  const leadRef = leadData?.ref as string | undefined;

  const navItems = [
    { href: "/", icon: "info", label: "Introduction" },
    { href: "/applicants", icon: "group", label: "Applicants" },
    { href: "/personal-details", icon: "person", label: "Personal Details" },
    { href: "/employment-income", icon: "work", label: "Employment & Income" },
    { href: "/assets", icon: "account_balance", label: "Assets" },
    { href: "/liabilities", icon: "credit_card", label: "Liabilities" },
    { href: "/living-expenses", icon: "account_balance_wallet", label: "Living Expenses" },
  ];

  const calculateProgress = () => {
    switch (pathname) {
      case "/":
        return 0;
      case "/applicants":
        return 16;
      case "/personal-details":
        return 33;
      case "/employment-income":
        return 50;
      case "/assets":
        return 66;
      case "/liabilities":
        return 83;
      case "/living-expenses":
        return 100;
      default:
        return 0;
    }
  };

  const currentProgress = calculateProgress();
  const currentStep = navItems.find((item) => item.href === pathname);
  const currentStepIndex = navItems.findIndex((item) => item.href === pathname);

  return (
    <aside className="w-full shrink-0 border-b border-primary/10 bg-white dark:bg-background-dark/50 md:w-80 md:border-b-0 md:border-r md:sticky md:top-[73px] md:h-[calc(100vh-73px)] md:flex md:flex-col md:gap-6 md:p-6">
      {/* Mobile compact bar */}
      <div className="flex items-center justify-between p-4 md:hidden">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-primary">{currentStep?.icon ?? "info"}</span>
          <span className="text-sm font-semibold text-primary dark:text-slate-100">
            Step {currentStepIndex + 1} of {navItems.length} — {currentStep?.label ?? "Introduction"}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex size-8 items-center justify-center rounded-md text-slate-500 hover:bg-primary/5"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[20px]">
            {mobileOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile progress bar (always visible) */}
      <div className="px-4 pb-3 md:hidden">
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
      </div>

      {/* Mobile expandable nav */}
      {mobileOpen && (
        <nav className="flex flex-col gap-1 border-t border-primary/10 px-4 pb-4 md:hidden">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            if (isActive) {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-white shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
              );
            }
            if (item.href === "#") {
              return (
                <div
                  key={item.label}
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 dark:text-slate-400"
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400"
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}

      {/* Desktop sidebar — hidden on mobile */}
      <div className="hidden md:flex md:flex-col md:gap-2 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-primary dark:text-slate-100">
              Fact Find Form
            </h1>
            {leadRef && <p className="text-xs text-slate-500">Ref: {leadRef}</p>}
          </div>
        </div>
      </div>
      <nav className="hidden md:flex flex-col gap-1 overflow-y-auto pr-2 shrink md:flex-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (isActive) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-white shadow-sm shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            );
          }

          if (item.href === "#") {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400 shrink-0"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
              </div>
            );
          }

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400 shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="hidden md:block mt-auto border-t border-primary/10 pt-6 shrink-0">
        <div className="mb-2 flex justify-between items-end">
          <span className="text-xs font-bold text-primary dark:text-slate-300">
            Form Progress
          </span>
          <span className="text-xs font-bold text-primary dark:text-slate-300">
            {currentProgress}%
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          />
        </div>
        <p className="mt-4 text-[11px] italic leading-relaxed text-slate-500">
          Your progress is automatically saved as you go.
        </p>
      </div>
    </aside>
  );
}

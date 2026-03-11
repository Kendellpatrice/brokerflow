"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SidebarNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: "info", label: "Introduction" },
    { href: "/applicants", icon: "group", label: "Applicants" },
    { href: "/personal-details", icon: "person", label: "Personal Details" },
    { href: "#", icon: "work", label: "Employment & Income" },
    { href: "#", icon: "account_balance", label: "Assets" },
    { href: "#", icon: "credit_card", label: "Liabilities" },
    { href: "#", icon: "account_balance_wallet", label: "Living Expenses" },
  ];

  const calculateProgress = () => {
    switch (pathname) {
      case "/":
        return 0;
      case "/applicants":
        return 16;
      case "/personal-details":
        return 33;
      default:
        return 0;
    }
  };

  const currentProgress = calculateProgress();

  return (
    <aside className="flex w-full flex-col gap-6 border-r border-primary/10 bg-white p-6 dark:bg-background-dark/50 md:w-80 shrink-0">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">description</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-primary dark:text-slate-100">
              Fact Find Form
            </h1>
            <p className="text-xs text-slate-500">Ref: UB-2024-8832</p>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;

          if (isActive) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-lg bg-primary px-4 py-3 text-white shadow-sm"
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
                  className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400"
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
              className="flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 hover:bg-primary/5 dark:text-slate-400"
            >
              <span className="material-symbols-outlined text-[20px]">
                {item.icon}
              </span>
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto border-t border-primary/5 pt-6">
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

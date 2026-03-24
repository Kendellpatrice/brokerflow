"use client";

import { useState } from "react";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/broker" },
  { icon: "account_tree", label: "Pipeline", href: "/broker/pipeline" },
  { icon: "groups", label: "Clients", href: "#" },
  { icon: "calendar_today", label: "Calendar", href: "#" },
  { icon: "analytics", label: "Reports", href: "#" },
];

function SidebarContents({
  activeHref,
  onNavClick,
}: {
  activeHref: string;
  onNavClick?: () => void;
}) {
  return (
    <>
      <div className="flex items-center gap-3 p-6">
        <div className="rounded-lg bg-primary p-2 text-white">
          <span className="material-symbols-outlined">account_balance</span>
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">BrokerCRM</h1>
          <p className="text-xs text-slate-500">AU Mortgage Solutions</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4">
        {navItems.map(({ icon, label, href }) => (
          <a
            key={label}
            href={href}
            onClick={onNavClick}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors",
              activeHref === href
                ? "bg-primary/10 text-primary"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
            ].join(" ")}
          >
            <span className="material-symbols-outlined text-[20px]">{icon}</span>
            {label}
          </a>
        ))}
      </nav>

      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <div className="flex items-center gap-3 p-2">
          <div
            className="size-10 shrink-0 rounded-full bg-slate-200 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCQPXcCfcK-NTqr0FUpR8Acx_jcAJqxaB8cA_oyzdYPuSbmfWqB_G37CnObgfNbnnPSiJxEGKUNXdT8U1lbHRBKG3Xt-WsOqLOH0eh7KCzH2Gf3uHjqeU3SMHaqKFRTMMfVHVqWXaKqd3pcawqjMVWYw0AOWTsi3_QQtmgXnt8DKRj6Kg8gkHtfFUgm7zVZPD-G49etQ3t6Pv-MQmxLWNvf7mgmq5RsZClFFdn7lqtsDAwBTK7jtS6t-aMXxijepyyEK5DC8MvtRwn2')",
            }}
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">James Anderson</p>
            <p className="text-xs text-slate-500">Senior Broker</p>
          </div>
          <span className="material-symbols-outlined text-slate-400">settings</span>
        </div>
      </div>
    </>
  );
}

type Props = {
  title: string;
  activeHref?: string;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
};

export function BrokerShell({ title, activeHref = "/broker", headerRight, children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <SidebarContents activeHref={activeHref} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:hidden">
            <div className="flex items-center justify-end px-4 pt-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                aria-label="Close menu"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <SidebarContents
              activeHref={activeHref}
              onNavClick={() => setSidebarOpen(false)}
            />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-y-auto">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-8 md:py-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold md:text-xl">{title}</h2>
          </div>
          {headerRight && (
            <div className="flex items-center gap-2 md:gap-4">{headerRight}</div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

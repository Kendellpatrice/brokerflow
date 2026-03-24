"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth";
import { useAuth } from "@/context/auth";
import { useBrokerProfile } from "@/context/brokerProfile";

const navItems = [
  { icon: "dashboard", label: "Dashboard", href: "/broker" },
  { icon: "account_tree", label: "Pipeline", href: "/broker/pipeline" },
  { icon: "group", label: "Leads", href: "/broker/leads" },
  { icon: "calendar_today", label: "Calendar", href: "#" },
  { icon: "analytics", label: "Reports", href: "#" },
];

function SidebarContents({
  activeHref,
  onNavClick,
  onSignOut,
  orgName,
  displayName,
}: {
  activeHref: string;
  onNavClick?: () => void;
  onSignOut: () => void;
  orgName: string;
  displayName: string;
}) {
  return (
    <>
      <div className="flex items-center gap-3 p-6">
        <div className="rounded-lg bg-primary p-2 text-white">
          <span className="material-symbols-outlined">account_balance</span>
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold leading-none">BrokerCRM</h1>
          <p className="truncate text-xs text-slate-500">{orgName}</p>
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <span className="material-symbols-outlined text-[20px]">person</span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{displayName || "Broker"}</p>
            <p className="text-xs text-slate-500">Logged in</p>
          </div>
          <button
            type="button"
            onClick={onSignOut}
            title="Sign out"
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
          </button>
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
  const router = useRouter();
  const { user } = useAuth();
  const { profile, loading: profileLoading } = useBrokerProfile();

  useEffect(() => {
    if (!profileLoading && user && !profile) {
      router.replace("/broker/onboarding");
    }
  }, [profile, profileLoading, user, router]);

  const handleSignOut = async () => {
    await logout();
    document.cookie = "session=; path=/; max-age=0";
    router.push("/login");
  };

  return (
    <div className="flex h-dvh overflow-hidden bg-background-light dark:bg-background-dark">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <SidebarContents
          activeHref={activeHref}
          onSignOut={handleSignOut}
          orgName={profile?.orgName ?? ""}
          displayName={profile?.displayName ?? ""}
        />
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
              onSignOut={handleSignOut}
              orgName={profile?.orgName ?? ""}
              displayName={profile?.displayName ?? ""}
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

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

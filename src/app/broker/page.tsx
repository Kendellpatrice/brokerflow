"use client";

import { useState } from "react";

const settlements = [
  {
    name: "Sarah Jenkins",
    type: "First Home Buyer",
    amount: "$720,000 AUD",
    lvr: "80%",
    date: "12 Oct 2023",
    status: "Pending",
    statusColor: "bg-amber-100 text-amber-700",
  },
  {
    name: "Michael Chen",
    type: "Refinance",
    amount: "$1,150,000 AUD",
    lvr: "65%",
    date: "15 Oct 2023",
    status: "Confirmed",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
  {
    name: "David & Emma Wilson",
    type: "Investment Property",
    amount: "$540,000 AUD",
    lvr: "88%",
    date: "18 Oct 2023",
    status: "In Review",
    statusColor: "bg-primary/10 text-primary",
  },
  {
    name: "The Smith Family",
    type: "Owner Occupied",
    amount: "$890,000 AUD",
    lvr: "90%",
    date: "22 Oct 2023",
    status: "Confirmed",
    statusColor: "bg-emerald-100 text-emerald-700",
  },
];

const activity = [
  {
    icon: "task_alt",
    iconBg: "bg-primary/10 text-primary",
    text: (<>Application for <strong>Emma Wilson</strong> approved by CBA</>),
    time: "2 hours ago",
  },
  {
    icon: "outgoing_mail",
    iconBg: "bg-blue-100 text-blue-600",
    text: (<>Sent welcome pack to <strong>Robert Brown</strong></>),
    time: "5 hours ago",
  },
  {
    icon: "warning",
    iconBg: "bg-rose-100 text-rose-600",
    text: (<>Missing documents alert: <strong>John Doe</strong> — PAYG Summary</>),
    time: "Yesterday",
  },
  {
    icon: "person_add",
    iconBg: "bg-slate-100 text-slate-600",
    text: (<>New lead assigned: <strong>Alice Wong</strong></>),
    time: "Yesterday",
  },
];

const navItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "account_tree", label: "Pipeline" },
  { icon: "groups", label: "Clients" },
  { icon: "calendar_today", label: "Calendar" },
  { icon: "analytics", label: "Reports" },
];

function SidebarContents({ onNavClick }: { onNavClick?: () => void }) {
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
        {navItems.map(({ icon, label, active }) => (
          <a
            key={label}
            href="#"
            onClick={onNavClick}
            className={[
              "flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-colors",
              active
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

export default function BrokerPortalPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark">

      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 md:flex">
        <SidebarContents />
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
            <SidebarContents onNavClick={() => setSidebarOpen(false)} />
          </aside>
        </>
      )}

      {/* Main */}
      <main className="flex flex-1 flex-col overflow-y-auto">

        {/* Header */}
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-8 md:py-4">
          <div className="flex items-center gap-3">
            <button
              className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-bold md:text-xl">Dashboard</h2>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {/* Search — desktop only */}
            <div className="relative hidden w-64 md:block">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
                search
              </span>
              <input
                type="text"
                placeholder="Search clients, loans..."
                className="w-full rounded-lg border-none bg-slate-100 py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 dark:bg-slate-800"
              />
            </div>

            {/* Search icon — mobile only */}
            <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden">
              <span className="material-symbols-outlined">search</span>
            </button>

            <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            {/* Quick action — icon on mobile, full button on desktop */}
            <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white md:px-4 md:py-2">
              <span className="material-symbols-outlined text-[18px]">add</span>
              <span className="hidden sm:inline">Quick Action</span>
            </button>
          </div>
        </header>

        <div className="space-y-5 p-4 md:space-y-8 md:p-8">

          {/* Stats — 2-col on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 gap-3 md:gap-6 lg:grid-cols-4">
            {[
              { label: "Settlements This Month", value: "$4.2M AUD", delta: "+12%", up: true },
              { label: "New Leads", value: "28", delta: "+5%", up: true },
              { label: "Active Applications", value: "15", delta: "-2%", up: false },
              { label: "Lodge Rate", value: "82%", delta: "+3%", up: true },
            ].map(({ label, value, delta, up }) => (
              <div
                key={label}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 md:p-6"
              >
                <p className="text-xs font-medium text-slate-500 md:text-sm">{label}</p>
                <div className="mt-2 flex flex-wrap items-baseline gap-1.5 md:gap-2">
                  <span className="text-xl font-bold md:text-2xl">{value}</span>
                  <span className={`text-xs font-semibold ${up ? "text-emerald-600" : "text-rose-600"}`}>
                    {delta}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions — full-width on mobile */}
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto sm:py-2.5">
              <span className="material-symbols-outlined text-[20px]">person_add</span>
              Add New Lead
            </button>
            <button className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex">
              <span className="material-symbols-outlined text-[20px]">note_add</span>
              New Application
            </button>
            <button className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 sm:flex">
              <span className="material-symbols-outlined text-[20px]">mail</span>
              Bulk Email
            </button>
          </div>

          {/* Main grid */}
          <div className="grid grid-cols-1 gap-5 md:gap-8 lg:grid-cols-3">

            {/* Upcoming settlements */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800 md:p-6">
                <h3 className="font-bold md:text-lg">Upcoming Settlements</h3>
                <button className="text-sm font-semibold text-primary hover:underline">View All</button>
              </div>

              {/* Mobile: card list */}
              <div className="divide-y divide-slate-100 dark:divide-slate-800 sm:hidden">
                {settlements.map((s) => (
                  <div key={s.name} className="flex items-start justify-between gap-3 p-4">
                    <div className="min-w-0">
                      <div className="truncate font-semibold">{s.name}</div>
                      <div className="text-xs text-slate-500">{s.type}</div>
                      <div className="mt-1 text-sm font-medium">{s.amount}</div>
                      <div className="text-xs text-slate-400">{s.date} · LVR {s.lvr}</div>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${s.statusColor}`}>
                      {s.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desktop: table */}
              <div className="hidden overflow-x-auto sm:block">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                    <tr>
                      <th className="px-6 py-3">Client</th>
                      <th className="px-6 py-3">Amount</th>
                      <th className="px-6 py-3">LVR</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {settlements.map((s) => (
                      <tr key={s.name} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="px-6 py-4">
                          <div className="font-semibold">{s.name}</div>
                          <div className="text-xs text-slate-500">{s.type}</div>
                        </td>
                        <td className="px-6 py-4 font-medium">{s.amount}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.lvr}</td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{s.date}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${s.statusColor}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent activity */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="border-b border-slate-100 p-4 dark:border-slate-800 md:p-6">
                <h3 className="font-bold md:text-lg">Recent Activity</h3>
              </div>
              <div className="flex-1 space-y-5 overflow-y-auto p-4 md:space-y-6 md:p-6">
                {activity.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="relative">
                      <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${item.iconBg}`}>
                        <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      </div>
                      {i < activity.length - 1 && (
                        <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-slate-100 dark:bg-slate-800" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm">{item.text}</p>
                      <p className="mt-1 text-xs text-slate-500">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

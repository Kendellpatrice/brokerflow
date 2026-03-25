"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrokerShell } from "@/components/BrokerShell";
import { db } from "@/lib/firestore";
import { collection, query, where, orderBy, limit, getDocs, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import type { ActivityType } from "@/lib/activity";

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

interface ActivityEntry {
  id: string;
  type: ActivityType;
  leadName: string;
  leadId: string;
  createdAt: Timestamp | null;
}

function timeAgo(ts: Timestamp | null): string {
  if (!ts) return "";
  const secs = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
  if (secs < 60) return "Just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 172800) return "Yesterday";
  return ts.toDate().toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

const ACTIVITY_META: Record<ActivityType, { icon: string; iconBg: string; label: string }> = {
  lead_created: { icon: "person_add", iconBg: "bg-slate-100 text-slate-600", label: "New lead added" },
  invite_sent: { icon: "outgoing_mail", iconBg: "bg-blue-100 text-blue-600", label: "Invitation sent to" },
  fact_find_submitted: { icon: "task_alt", iconBg: "bg-emerald-100 text-emerald-600", label: "Fact Find submitted by" },
};

export default function BrokerPortalPage() {
  const { user } = useAuth();
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "brokerActivity"),
      where("brokerId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(8)
    );
    getDocs(q)
      .then((snap) => {
        setActivity(snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<ActivityEntry, "id">) })));
      })
      .finally(() => setActivityLoading(false));
  }, [user]);

  const headerRight = (
    <>
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
      <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:hidden">
        <span className="material-symbols-outlined">search</span>
      </button>
      <button className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 md:p-2">
        <span className="material-symbols-outlined">notifications</span>
      </button>
      <Link
        href="/broker/leads/new"
        className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white md:px-4 md:py-2"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        <span className="hidden sm:inline">Quick Action</span>
      </Link>
    </>
  );

  return (
    <BrokerShell title="Dashboard" headerRight={headerRight}>
      <div className="space-y-5 p-4 md:space-y-8 md:p-8">

        {/* Stats */}
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

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2 sm:gap-3">
          <Link
            href="/broker/leads/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-primary/90 sm:w-auto sm:py-2.5"
          >
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add New Lead
          </Link>
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
            <div className="flex items-center justify-between border-b border-slate-100 p-4 dark:border-slate-800 md:p-6">
              <h3 className="font-bold md:text-lg">Recent Activity</h3>
            </div>

            {activityLoading ? (
              <div className="flex items-center justify-center py-12 text-slate-400">
                <span className="material-symbols-outlined animate-spin text-[24px]">progress_activity</span>
              </div>
            ) : activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <span className="material-symbols-outlined text-[28px] text-slate-300">timeline</span>
                <p className="text-sm text-slate-400">No activity yet.</p>
              </div>
            ) : (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto p-4 md:space-y-6 md:p-6">
                  {activity.map((item, i) => {
                    const meta = ACTIVITY_META[item.type] ?? ACTIVITY_META.lead_created;
                    return (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative">
                          <div className={`flex size-8 shrink-0 items-center justify-center rounded-full ${meta.iconBg}`}>
                            <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
                          </div>
                          {i < activity.length - 1 && (
                            <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-slate-100 dark:bg-slate-800" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm">
                            {meta.label}{" "}
                            <Link
                              href={`/broker/leads/${item.leadId}`}
                              className="font-semibold hover:underline"
                            >
                              {item.leadName}
                            </Link>
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{timeAgo(item.createdAt)}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-slate-100 p-4 dark:border-slate-800">
                  <Link
                    href="/broker/activity"
                    className="flex items-center justify-center gap-1.5 text-sm font-semibold text-primary"
                  >
                    <span className="hover:underline">View More</span>
                    <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                  </Link>
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </BrokerShell>
  );
}

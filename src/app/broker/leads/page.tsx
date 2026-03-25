"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BrokerShell } from "@/components/BrokerShell";
import { db } from "@/lib/firestore";
import { collection, query, where, orderBy, getDocs, doc, updateDoc, deleteField, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth";
import { createAndSendInvite } from "@/lib/invite";

interface Lead {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  loanPurpose: string;
  loanAmount: string;
  createdAt: Timestamp | null;
  activeInviteToken?: string;
  ref?: string;
  factFindStatus?: string;
}

const LOAN_PURPOSE_LABELS: Record<string, string> = {
  purchase: "Purchase",
  refinance: "Refinance",
  equity_release: "Equity Release",
  other: "Other",
};

const LOAN_PURPOSE_STYLES: Record<string, string> = {
  purchase: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  refinance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  equity_release: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  other: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

function formatDate(ts: Timestamp | null) {
  if (!ts) return "—";
  return ts.toDate().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

export default function LeadsPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState<string | null>(null);
  const [sentFor, setSentFor] = useState<string | null>(null);
  const [unlocking, setUnlocking] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "brokerLeads"),
      where("brokerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((snap) => {
        setLeads(
          snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Lead, "id">) }))
        );
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleResend = async (lead: Lead) => {
    setResending(lead.id);
    try {
      await createAndSendInvite({
        brokerId: user?.uid,
        leadId: lead.id,
        leadName: lead.fullName,
        leadEmail: lead.email,
        leadRef: lead.ref,
        previousToken: lead.activeInviteToken,
      });
      // Update local state so the button reflects the new token exists
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, activeInviteToken: "sent" } : l))
      );
      setSentFor(lead.id);
      setTimeout(() => setSentFor(null), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to send invitation.");
    } finally {
      setResending(null);
    }
  };

  const handleUnlock = async (lead: Lead) => {
    setUnlocking(lead.id);
    try {
      await updateDoc(doc(db, "brokerLeads", lead.id), {
        factFindStatus: deleteField(),
      });
      setLeads((prev) =>
        prev.map((l) => (l.id === lead.id ? { ...l, factFindStatus: undefined } : l))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to unlock fact find.");
    } finally {
      setUnlocking(null);
    }
  };

  const headerRight = (
    <Link
      href="/broker/leads/new"
      className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white transition hover:bg-primary/90 md:px-4 md:py-2"
    >
      <span className="material-symbols-outlined text-[18px]">add</span>
      <span className="hidden sm:inline">Add Lead</span>
    </Link>
  );

  const [statusFilter, setStatusFilter] = useState("");
  const [loanTypeFilter, setLoanTypeFilter] = useState("");

  return (
    <BrokerShell title="Leads" activeHref="/broker/leads" headerRight={headerRight}>
      <div className="p-4 md:p-8">

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Leads</h1>
            {!loading && (
              <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                You have <span className="font-bold text-slate-700 dark:text-slate-200">{leads.length}</span> active lead{leads.length !== 1 ? "s" : ""} in your portfolio.
              </p>
            )}
          </div>
          <div className="flex shrink-0 gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-[18px]">download</span>
              Export CSV
            </button>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Bulk Actions
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</p>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <option value="">All Statuses</option>
                  <option value="new">New</option>
                  <option value="invited">Invited</option>
                  <option value="submitted">Submitted</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Loan Type</p>
              <div className="relative">
                <select
                  value={loanTypeFilter}
                  onChange={(e) => setLoanTypeFilter(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2.5 pl-3 pr-8 text-sm font-medium text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                >
                  <option value="">All Types</option>
                  <option value="purchase">Purchase</option>
                  <option value="refinance">Refinance</option>
                  <option value="equity_release">Equity Release</option>
                  <option value="other">Other</option>
                </select>
                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">expand_more</span>
              </div>
            </div>
            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">Date Range</p>
              <button className="flex w-full items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-[16px] text-slate-400">calendar_today</span>
                Last 30 Days
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24 text-slate-400">
            <span className="material-symbols-outlined animate-spin text-[28px]">progress_activity</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
            <div className="flex size-14 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800">
              <span className="material-symbols-outlined text-[28px] text-slate-400">group</span>
            </div>
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-300">No leads yet</p>
              <p className="mt-1 text-sm text-slate-500">Add your first lead to get started.</p>
            </div>
            <Link
              href="/broker/leads/new"
              className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <span className="material-symbols-outlined text-[18px]">person_add</span>
              Add New Lead
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: card list */}
            <div className="flex flex-col gap-3 sm:hidden">
              {leads.map((lead) => (
                <div
                  key={lead.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{lead.fullName}</p>
                      <p className="text-xs text-slate-500">{lead.email}</p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      {lead.loanPurpose && (
                        <span className={`rounded px-2 py-0.5 text-xs font-bold ${LOAN_PURPOSE_STYLES[lead.loanPurpose] ?? "bg-slate-100 text-slate-700"}`}>
                          {LOAN_PURPOSE_LABELS[lead.loanPurpose] ?? lead.loanPurpose}
                        </span>
                      )}
                      <LeadStatusBadge lead={lead} />
                    </div>
                  </div>
                  <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {lead.phone && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">phone</span>
                        {lead.phone}
                      </span>
                    )}
                    {lead.loanAmount && (
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px]">payments</span>
                        ${lead.loanAmount}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">calendar_today</span>
                      {formatDate(lead.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {lead.factFindStatus === "submitted" ? (
                      <UnlockButton loading={unlocking === lead.id} onClick={() => handleUnlock(lead)} />
                    ) : (
                      <ResendButton
                        sent={sentFor === lead.id}
                        loading={resending === lead.id}
                        hasToken={!!lead.activeInviteToken}
                        onClick={() => handleResend(lead)}
                      />
                    )}
                    <Link
                      href={`/broker/leads/${lead.id}`}
                      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                    >
                      <span className="material-symbols-outlined text-[14px]">edit</span>
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: table */}
            <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-500 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3">Lead</th>
                    <th className="px-6 py-3">Phone</th>
                    <th className="px-6 py-3">Loan Purpose</th>
                    <th className="px-6 py-3">Amount</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Added</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/30">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">{lead.fullName}</p>
                        <p className="text-xs text-slate-500">{lead.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{lead.phone || "—"}</td>
                      <td className="px-6 py-4">
                        {lead.loanPurpose ? (
                          <span className={`rounded px-2 py-0.5 text-xs font-bold ${LOAN_PURPOSE_STYLES[lead.loanPurpose] ?? "bg-slate-100 text-slate-700"}`}>
                            {LOAN_PURPOSE_LABELS[lead.loanPurpose] ?? lead.loanPurpose}
                          </span>
                        ) : (
                          <span className="text-sm text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                        {lead.loanAmount ? `$${lead.loanAmount}` : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <LeadStatusBadge lead={lead} />
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(lead.createdAt)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {lead.factFindStatus === "submitted" ? (
                            <UnlockButton loading={unlocking === lead.id} onClick={() => handleUnlock(lead)} />
                          ) : (
                            <ResendButton
                              sent={sentFor === lead.id}
                              loading={resending === lead.id}
                              hasToken={!!lead.activeInviteToken}
                              onClick={() => handleResend(lead)}
                            />
                          )}
                          <Link
                            href={`/broker/leads/${lead.id}`}
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
                          >
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </BrokerShell>
  );
}

function LeadStatusBadge({ lead }: { lead: Lead }) {
  if (lead.factFindStatus === "submitted") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        <span className="material-symbols-outlined text-[11px]">task_alt</span>
        Submitted
      </span>
    );
  }
  if (lead.activeInviteToken) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold text-primary dark:bg-primary/20">
        <span className="material-symbols-outlined text-[11px]">outgoing_mail</span>
        Invited
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
      <span className="material-symbols-outlined text-[11px]">person</span>
      New
    </span>
  );
}

function UnlockButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 transition hover:border-amber-300 hover:bg-amber-100 disabled:opacity-50 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-400"
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
          Unlocking…
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[14px]">lock_open</span>
          Unlock
        </>
      )}
    </button>
  );
}

function ResendButton({
  sent,
  loading,
  hasToken,
  onClick,
}: {
  sent: boolean;
  loading: boolean;
  hasToken: boolean;
  onClick: () => void;
}) {
  if (sent) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400">
        <span className="material-symbols-outlined text-[14px]">mark_email_read</span>
        Sent
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading}
      className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
    >
      {loading ? (
        <>
          <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
          Sending…
        </>
      ) : (
        <>
          <span className="material-symbols-outlined text-[14px]">send</span>
          {hasToken ? "Resend Invitation" : "Send Invitation"}
        </>
      )}
    </button>
  );
}

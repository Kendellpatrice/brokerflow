"use client";

import { useEffect, useState } from "react";
import { BrokerShell } from "@/components/BrokerShell";
import { db } from "@/lib/firestore";
import { collection, query, where, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { useAuth } from "@/context/auth";

// ── Types ──────────────────────────────────────────────────────────────────

type LoanType = "Purchase" | "Refinance" | "Equity Release" | "Other";

type CardFooter =
  | { type: "timestamp"; text: string }
  | { type: "warning"; text: string }
  | { type: "lastUpdate"; text: string }
  | { type: "progress"; percent: number }
  | { type: "verified" };

interface PipelineCard {
  id: string;
  loanType: LoanType;
  lender?: string;
  client: string;
  amount?: string;
  lvr?: string;
  highlight?: boolean;
  footer: CardFooter;
  factFindSubmitted?: boolean;
  inviteSent?: boolean;
}

interface Column {
  id: string;
  label: string;
  cards: PipelineCard[];
  loading?: boolean;
  emptyIcon?: string;
  emptyText?: string;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

const LOAN_PURPOSE_MAP: Record<string, LoanType> = {
  purchase: "Purchase",
  refinance: "Refinance",
  equity_release: "Equity Release",
  other: "Other",
};

function timeAgo(ts: Timestamp): string {
  const seconds = Math.floor((Date.now() - ts.toDate().getTime()) / 1000);
  if (seconds < 60) return "Just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 172800) return "Yesterday";
  return ts.toDate().toLocaleDateString("en-AU", { day: "numeric", month: "short" });
}

// ── Static demo columns (everything except New Leads) ──────────────────────

const DEMO_COLUMNS: Column[] = [
  {
    id: "pre_approval",
    label: "Pre-approval",
    cards: [
      {
        id: "d3",
        loanType: "Purchase",
        lender: "NAB",
        client: "David Wilson",
        amount: "$1.2M",
        lvr: "65%",
        footer: { type: "warning", text: "Expires in 12 days" },
      },
    ],
  },
  {
    id: "lodged",
    label: "Lodged",
    cards: [
      {
        id: "d4",
        loanType: "Equity Release",
        lender: "Westpac",
        client: "Emma Thompson",
        amount: "$450k",
        lvr: "95%",
        footer: { type: "lastUpdate", text: "Pending valuation appointment" },
      },
    ],
  },
  {
    id: "conditional_approval",
    label: "Conditional Approval",
    cards: [
      {
        id: "d5",
        loanType: "Refinance",
        lender: "Macquarie",
        client: "Michael Chen",
        amount: "$880k",
        lvr: "70%",
        footer: { type: "progress", percent: 60 },
      },
    ],
  },
  {
    id: "unconditional",
    label: "Unconditional",
    cards: [
      {
        id: "d6",
        loanType: "Purchase",
        lender: "Suncorp",
        client: "Robert Smith",
        amount: "$600k",
        lvr: "85%",
        highlight: true,
        footer: { type: "verified" },
      },
    ],
  },
  {
    id: "settlement",
    label: "Settlement",
    cards: [],
    emptyIcon: "event_available",
    emptyText: "No upcoming settlements",
  },
];

// ── Styles ──────────────────────────────────────────────────────────────────

const LOAN_TYPE_STYLES: Record<LoanType, string> = {
  Purchase: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  Refinance: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  "Equity Release": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  Other: "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300",
};

// ── Card footer renderers ───────────────────────────────────────────────────

function CardFooterContent({ footer }: { footer: CardFooter }) {
  switch (footer.type) {
    case "timestamp":
      return (
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="text-[10px] text-slate-400">{footer.text}</span>
        </div>
      );
    case "warning":
      return (
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800">
          <span className="flex items-center gap-1 text-[10px] font-medium text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-[12px]">warning</span>
            {footer.text}
          </span>
        </div>
      );
    case "lastUpdate":
      return (
        <div className="mt-1 rounded border border-slate-100 bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800">
          <p className="mb-0.5 text-[10px] font-bold uppercase text-slate-500">Last Update</p>
          <p className="text-[11px] text-slate-700 dark:text-slate-300">{footer.text}</p>
        </div>
      );
    case "progress":
      return (
        <div className="mt-1 flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-[10px]">
            <span className="text-slate-500">Document progress</span>
            <span className="font-bold">{footer.percent}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-full rounded-full bg-primary" style={{ width: `${footer.percent}%` }} />
          </div>
        </div>
      );
    case "verified":
      return (
        <div className="flex items-center gap-1.5 border-t border-slate-100 pt-3 text-emerald-600 dark:border-slate-800 dark:text-emerald-400">
          <span className="material-symbols-outlined text-[18px]">verified</span>
          <span className="text-[10px] font-bold uppercase tracking-tight">Documents Issued</span>
        </div>
      );
  }
}

// ── Pipeline card ──────────────────────────────────────────────────────────

function KanbanCard({ card }: { card: PipelineCard }) {
  return (
    <div
      className={[
        "cursor-grab rounded-lg border bg-white p-4 shadow-sm transition active:cursor-grabbing dark:bg-slate-900",
        card.highlight
          ? "border-emerald-400 ring-2 ring-emerald-500 ring-offset-2 ring-offset-slate-200 dark:border-emerald-400 dark:ring-emerald-400 dark:ring-offset-slate-800"
          : "border-slate-200 dark:border-slate-700",
      ].join(" ")}
    >
      {/* Loan type + lender */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <span className={`rounded px-2 py-0.5 text-xs font-bold ${LOAN_TYPE_STYLES[card.loanType]}`}>
          {card.loanType}
        </span>
        {card.lender && (
          <div className="flex h-5 min-w-10 items-center justify-center rounded bg-slate-100 px-1.5 text-[8px] font-bold text-slate-500 dark:bg-slate-700 dark:text-slate-400">
            {card.lender}
          </div>
        )}
      </div>

      {/* Client name + status badge */}
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <h4 className="font-bold text-slate-900 dark:text-white">{card.client}</h4>
        {card.factFindSubmitted ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[9px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
            <span className="material-symbols-outlined text-[10px]">task_alt</span>
            Submitted
          </span>
        ) : card.inviteSent ? (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-[9px] font-bold text-primary dark:bg-primary/20">
            <span className="material-symbols-outlined text-[10px]">outgoing_mail</span>
            Invited
          </span>
        ) : null}
      </div>

      {/* Amount + LVR */}
      {(card.amount || card.lvr) && (
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          {card.amount && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">payments</span>
              {card.amount}
            </span>
          )}
          {card.lvr && (
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">pie_chart</span>
              {card.lvr} LVR
            </span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="mt-3">
        <CardFooterContent footer={card.footer} />
      </div>
    </div>
  );
}

// ── Pipeline column ────────────────────────────────────────────────────────

function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="flex h-fit w-72 shrink-0 flex-col rounded-xl bg-slate-200/60 p-3 dark:bg-slate-800/50">
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {column.label}
          </h3>
          {!column.loading && (
            <span className="rounded-full bg-slate-300 px-2 py-0.5 text-xs font-bold dark:bg-slate-700">
              {column.cards.length}
            </span>
          )}
        </div>
        <button className="rounded p-0.5 text-slate-400 hover:bg-slate-300/60 hover:text-slate-600 dark:hover:bg-slate-700/60">
          <span className="material-symbols-outlined text-[20px]">more_horiz</span>
        </button>
      </div>

      {/* Loading skeleton */}
      {column.loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="h-24 animate-pulse rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" />
          ))}
        </div>
      ) : column.cards.length > 0 ? (
        <div className="flex flex-col gap-3">
          {column.cards.map((card) => (
            <KanbanCard key={card.id} card={card} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-300 py-10 text-slate-400 dark:border-slate-700">
          <span className="material-symbols-outlined text-[32px]">{column.emptyIcon}</span>
          <p className="text-xs">{column.emptyText}</p>
        </div>
      )}
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function PipelinePage() {
  const { user } = useAuth();
  const [newLeadsCards, setNewLeadsCards] = useState<PipelineCard[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "brokerLeads"),
      where("brokerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    getDocs(q)
      .then((snap) => {
        setNewLeadsCards(
          snap.docs.map((d) => {
            const data = d.data();
            const loanType: LoanType = LOAN_PURPOSE_MAP[data.loanPurpose as string] ?? "Other";
            const createdAt = data.createdAt as Timestamp | null;
            return {
              id: d.id,
              loanType,
              client: data.fullName as string,
              amount: data.loanAmount ? `$${data.loanAmount}` : undefined,
              inviteSent: !!data.activeInviteToken,
              factFindSubmitted: data.factFindStatus === "submitted",
              footer: {
                type: "timestamp" as const,
                text: createdAt ? `Added ${timeAgo(createdAt)}` : "Just added",
              },
            };
          })
        );
      })
      .finally(() => setLoadingLeads(false));
  }, [user]);

  const columns: Column[] = [
    {
      id: "new_leads",
      label: "New Leads",
      cards: newLeadsCards,
      loading: loadingLeads,
      emptyIcon: "person_add",
      emptyText: "No new leads",
    },
    ...DEMO_COLUMNS,
  ];

  const headerRight = (
    <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-sm font-bold text-white transition hover:bg-primary/90 md:px-4 md:py-2">
      <span className="material-symbols-outlined text-[18px]">add</span>
      <span className="hidden sm:inline">Add New Application</span>
    </button>
  );

  return (
    <BrokerShell title="Pipeline" activeHref="/broker/pipeline" headerRight={headerRight}>
      <div className="flex h-full flex-col">

        {/* Sub-header: filters */}
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">Broker Pipeline</p>
              <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-[13px]">location_on</span>
                NSW Region · All Commercial &amp; Residential
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-[16px]">person</span>
                All Brokers
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              <button className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-100 px-3 text-xs font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
                <span className="material-symbols-outlined text-[16px]">filter_list</span>
                Loan Type
                <span className="material-symbols-outlined text-[16px]">expand_more</span>
              </button>

              <div className="flex h-8 items-center gap-0.5 rounded-lg border border-slate-200 bg-slate-100 p-1 dark:border-slate-700 dark:bg-slate-800">
                <button className="rounded px-3 py-1 text-xs font-bold text-primary shadow-sm ring-1 ring-slate-200/80 bg-white dark:bg-slate-700 dark:text-white dark:ring-slate-600">
                  Pipeline
                </button>
                <button className="rounded px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700 dark:hover:text-slate-300">
                  List View
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Kanban board */}
        <div className="flex-1 overflow-x-auto overflow-y-auto bg-background-light dark:bg-background-dark">
          <div className="flex h-full gap-4 p-4 pb-8 md:gap-6 md:p-6">
            {columns.map((column) => (
              <KanbanColumn key={column.id} column={column} />
            ))}
          </div>
        </div>

      </div>
    </BrokerShell>
  );
}

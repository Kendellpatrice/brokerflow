"use client";

import { PageShell } from "@/components/PageShell";
import { CurrencyInput } from "@/components/CurrencyInput";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { PhaseDivider } from "@/components/PhaseDivider";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth";
import { useFactFindStatus } from "@/context/factFindStatus";
import { saveLeadData, loadLeadData } from "@/lib/firestore";

// ── Types ─────────────────────────────────────────────────────────────────
type YesNo     = "" | "yes" | "no";
type YesNoNA   = "" | "yes" | "no" | "na";
type YesNoNS   = "" | "yes" | "no" | "not-sure";

// Shared liability entry — every category uses a subset of these fields
interface LiabilityEntry {
  id: number;
  lender: string;
  bsb: string;          // credit cards: last 4 digits
  acct: string;
  propertyRef: string;  // mortgages only
  description: string;  // other liabilities only
  limit: string;
  amountOwing: string;
  monthlyRepayment: string;
  clearing: YesNo;
  rate: string;
  remainingTerm: string;
  ownerApp1: boolean;
  ownerApp2: boolean;
}

const blankEntry = (id: number): LiabilityEntry => ({
  id, lender: "", bsb: "", acct: "", propertyRef: "", description: "",
  limit: "", amountOwing: "", monthlyRepayment: "", clearing: "",
  rate: "", remainingTerm: "", ownerApp1: false, ownerApp2: false,
});

// ── Reusable list-management hook factory ─────────────────────────────────
function useEntryList() {
  const [items, setItems] = useState<LiabilityEntry[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  const add = () => {
    const n = blankEntry(Date.now());
    setItems(p => [...p, n]);
    setEditingId(n.id);
  };

  const remove = (id: number) => {
    setItems(p => p.filter(e => e.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const update = (id: number, field: keyof LiabilityEntry, value: string | boolean) =>
    setItems(p => p.map(e => e.id === id ? { ...e, [field]: value } : e));

  const toggleEdit = (id: number) =>
    setEditingId(prev => (prev === id ? null : id));

  return { items, editingId, add, remove, update, toggleEdit };
}

// ── Shared sub-components ─────────────────────────────────────────────────
function OwnershipBadge({ app1, app2 }: { app1: boolean; app2: boolean }) {
  if (!app1 && !app2) return <span className="text-slate-400 italic text-xs">—</span>;
  const label = app1 && app2 ? "Joint" : app1 ? "App. 1" : "App. 2";
  return (
    <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
      {label}
    </span>
  );
}

function EmptyState({ icon, label, onAdd }: { icon: string; label: string; onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[48px] mb-3">{icon}</span>
      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">No {label} added yet.</p>
      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary/90 transition-colors"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        Add {label}
      </button>
    </div>
  );
}

function AddButton({ label, onAdd }: { label: string; onAdd: () => void }) {
  return (
    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700">
      <button
        type="button"
        onClick={onAdd}
        className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 py-3.5 font-semibold text-primary transition-colors hover:border-primary/40 hover:bg-primary/10"
      >
        <span className="material-symbols-outlined text-[18px]">add_circle</span>
        Add {label}
      </button>
    </div>
  );
}

function RowActions({
  id, editingId, onToggleEdit, onRemove,
}: { id: number; editingId: number | null; onToggleEdit: (id: number) => void; onRemove: (id: number) => void }) {
  return (
    <div className="flex items-center gap-2 justify-end">
      <button
        type="button"
        title="Edit"
        onClick={() => onToggleEdit(id)}
        className={`flex items-center justify-center rounded-lg p-2.5 transition-colors ${
          editingId === id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"
        }`}
      >
        <span className="material-symbols-outlined text-[16px]">{editingId === id ? "close" : "edit"}</span>
      </button>
      <button
        type="button"
        title="Delete"
        onClick={() => onRemove(id)}
        className="flex items-center justify-center rounded-lg p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>
    </div>
  );
}

function MobileCard({
  id, editingId, onToggleEdit, onRemove, primary, secondary, badge, editForm,
}: {
  id: number; editingId: number | null;
  onToggleEdit: (id: number) => void; onRemove: (id: number) => void;
  primary: React.ReactNode; secondary?: string; badge?: React.ReactNode; editForm?: React.ReactNode;
}) {
  const isEditing = editingId === id;
  return (
    <div className={`rounded-xl border transition-colors ${isEditing ? "border-primary/30 bg-primary/5 dark:bg-primary/10" : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50"}`}>
      <div className="flex items-start justify-between gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-snug">{primary}</p>
          {secondary && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{secondary}</p>}
          {badge && <div className="mt-2">{badge}</div>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button type="button" title="Edit" onClick={() => onToggleEdit(id)}
            className={`flex items-center justify-center rounded-lg p-2.5 transition-colors ${isEditing ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
            <span className="material-symbols-outlined text-[16px]">{isEditing ? "close" : "edit"}</span>
          </button>
          <button type="button" title="Delete" onClick={() => onRemove(id)}
            className="flex items-center justify-center rounded-lg p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <span className="material-symbols-outlined text-[16px]">delete</span>
          </button>
        </div>
      </div>
      {isEditing && editForm && <div className="px-4 pb-4">{editForm}</div>}
    </div>
  );
}

function EditFormWrapper({ children, onDone }: { children: React.ReactNode; onDone: () => void }) {
  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/20 p-5 mt-1">
      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Edit Details</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {children}
      </div>
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={onDone}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
        >
          <span className="material-symbols-outlined text-[16px]">check</span>
          Done
        </button>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm";

function ClearingField({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <div className="flex gap-4 items-center h-9.5">
      {(["yes", "no"] as const).map(opt => (
        <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
          <input
            type="radio"
            value={opt}
            checked={value === opt}
            onChange={() => onChange(opt)}
            className="accent-primary"
          />
          {opt === "yes" ? "Yes" : "No"}
        </label>
      ))}
    </div>
  );
}

function OwnershipField({ app1, app2, onChangeApp1, onChangeApp2 }: {
  app1: boolean; app2: boolean;
  onChangeApp1: (v: boolean) => void; onChangeApp2: (v: boolean) => void;
}) {
  return (
    <div className="flex gap-4 items-center h-9.5">
      {[{ label: "Applicant 1", checked: app1, onChange: onChangeApp1 }, { label: "Applicant 2", checked: app2, onChange: onChangeApp2 }].map(o => (
        <label key={o.label} className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={o.checked} onChange={e => o.onChange(e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" />
          <span className="text-sm text-slate-700 dark:text-slate-300">{o.label}</span>
        </label>
      ))}
    </div>
  );
}

// ── Shared summary table shell ────────────────────────────────────────────
function SummaryTable({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700">
            {headers.map(h => (
              <th key={h} className={`pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4 ${h === "" ? "w-16" : ""}`}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

function dash(val: string) {
  return val ? val : <span className="text-slate-400 italic">—</span>;
}

// ── Credit History helper ─────────────────────────────────────────────────
function RadioGroup({ name, value, onChange, options }: {
  name: string; value: string; onChange: (v: string) => void;
  options: { label: string; value: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {options.map(opt => (
        <label key={opt.value} className="flex items-center gap-1.5 text-xs cursor-pointer select-none">
          <input type="radio" name={name} value={opt.value} checked={value === opt.value}
            onChange={() => onChange(opt.value)} className="accent-primary" />
          {opt.label}
        </label>
      ))}
    </div>
  );
}

// ── Insurance question row ────────────────────────────────────────────────
function InsuranceRow({ label, name, value, onChange }: {
  label: string; name: string; value: YesNoNS; onChange: (v: YesNoNS) => void;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
      <span className="text-sm text-slate-700 dark:text-slate-300 flex-1">{label}</span>
      <div className="flex items-center gap-3 sm:gap-5 shrink-0">
        {(["yes", "no", "not-sure"] as const).map(opt => (
          <label key={opt} className="flex items-center gap-1.5 text-sm cursor-pointer select-none">
            <input type="radio" name={name} value={opt} checked={value === opt}
              onChange={() => onChange(opt)} className="accent-primary" />
            {opt === "yes" ? "Yes" : opt === "no" ? "No" : "Not Sure"}
          </label>
        ))}
      </div>
    </div>
  );
}

// ── Common edit form for most liability types (module-level to prevent remount on re-render)
function LiabilityEditForm({
  entry, list, extraFields,
}: { entry: LiabilityEntry; list: ReturnType<typeof useEntryList>; extraFields?: React.ReactNode }) {
  return (
    <EditFormWrapper onDone={() => list.toggleEdit(entry.id)}>
      {extraFields}
      <Field label="Lender">
        <input type="text" value={entry.lender}
          onChange={e => list.update(entry.id, "lender", e.target.value)}
          className={inputCls} placeholder="e.g. CommBank" />
      </Field>
      <Field label="BSB">
        <input type="text" value={entry.bsb}
          onChange={e => list.update(entry.id, "bsb", e.target.value)}
          className={inputCls} />
      </Field>
      <Field label="Account #">
        <input type="text" value={entry.acct}
          onChange={e => list.update(entry.id, "acct", e.target.value)}
          className={inputCls} />
      </Field>
      <Field label="Limit">
        <CurrencyInput value={entry.limit}
          onChange={v => list.update(entry.id, "limit", v)} />
      </Field>
      <Field label="Amount Owing">
        <CurrencyInput value={entry.amountOwing}
          onChange={v => list.update(entry.id, "amountOwing", v)} />
      </Field>
      <Field label="Monthly Repayment">
        <CurrencyInput value={entry.monthlyRepayment}
          onChange={v => list.update(entry.id, "monthlyRepayment", v)} />
      </Field>
      <Field label="Clearing / Refinance">
        <ClearingField value={entry.clearing}
          onChange={v => list.update(entry.id, "clearing", v)} />
      </Field>
      <Field label="Interest Rate (%)">
        <input type="text" value={entry.rate}
          onChange={e => list.update(entry.id, "rate", e.target.value)}
          className={inputCls} placeholder="e.g. 6.25" />
      </Field>
      <Field label="Remaining Term / Expiry">
        <input type="text" value={entry.remainingTerm}
          onChange={e => list.update(entry.id, "remainingTerm", e.target.value)}
          className={inputCls} placeholder="e.g. 24 months" />
      </Field>
      <Field label="Ownership">
        <OwnershipField
          app1={entry.ownerApp1} app2={entry.ownerApp2}
          onChangeApp1={v => list.update(entry.id, "ownerApp1", v)}
          onChangeApp2={v => list.update(entry.id, "ownerApp2", v)}
        />
      </Field>
    </EditFormWrapper>
  );
}

// ══════════════════════════════════════════════════════════════════════════
// Page
// ══════════════════════════════════════════════════════════════════════════
export default function LiabilitiesPage() {
  const mortgages     = useEntryList();
  const personalLoans = useEntryList();
  const carFinance    = useEntryList();
  const creditCards   = useEntryList();
  const hecsHelp      = useEntryList();
  const otherLiabs    = useEntryList();

  // Other Items
  const [retirementApp1, setRetirementApp1] = useState("75");
  const [retirementApp2, setRetirementApp2] = useState("75");
  const [exitStrategy, setExitStrategy] = useState("");

  // Credit History
  const [credit, setCredit] = useState<{
    defaults:   [YesNoNA, YesNoNA];
    difficulty: [YesNoNA, YesNoNA];
    arrears:    [YesNoNA, YesNoNA];
    details: string;
  }>({ defaults: ["", ""], difficulty: ["", ""], arrears: ["", ""], details: "" });

  const updateCredit = (field: "defaults" | "difficulty" | "arrears", idx: 0 | 1, val: YesNoNA) =>
    setCredit(prev => { const next = [...prev[field]] as [YesNoNA, YesNoNA]; next[idx] = val; return { ...prev, [field]: next }; });

  // Insurance
  const [ins, setIns] = useState<Record<string, YesNoNS>>({});
  const setInsField = (k: string, v: YesNoNS) => setIns(p => ({ ...p, [k]: v }));

  // ── Firestore persistence ────────────────────────────────────────────────
  const { user } = useAuth();
  const { isSubmitted } = useFactFindStatus();
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    loadLeadData(user.uid).then((data) => {
      if (!data?.liabilities) return;
      const l = data.liabilities as Record<string, unknown>;
      if (l.mortgages) mortgages.items.length === 0 && (mortgages as unknown as { items: unknown[] }).items.splice(0, 0, ...(l.mortgages as unknown[]));
      if (l.retirementApp1) setRetirementApp1(l.retirementApp1 as string);
      if (l.retirementApp2) setRetirementApp2(l.retirementApp2 as string);
      if (l.exitStrategy) setExitStrategy(l.exitStrategy as string);
      if (l.credit) setCredit(l.credit as typeof credit);
      if (l.ins) setIns(l.ins as Record<string, YesNoNS>);
    });
  }, [user]);

  const handleSave = useCallback(async (nextPath?: string) => {
    if (isSubmitted) { if (nextPath) router.push(nextPath); return; }
    if (!user) { if (nextPath) router.push(nextPath); return; }
    setIsSaving(true);
    try {
      await saveLeadData(user.uid, {
        liabilities: {
          mortgages: mortgages.items,
          personalLoans: personalLoans.items,
          carFinance: carFinance.items,
          creditCards: creditCards.items,
          hecsHelp: hecsHelp.items,
          otherLiabs: otherLiabs.items,
          retirementApp1, retirementApp2, exitStrategy, credit, ins,
        },
      });
      if (nextPath) router.push(nextPath);
    } finally {
      setIsSaving(false);
    }
  }, [user, mortgages.items, personalLoans.items, carFinance.items, creditCards.items, hecsHelp.items, otherLiabs.items, retirementApp1, retirementApp2, exitStrategy, credit, ins, router, isSubmitted]);

  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 5 of 6
        </span>
        <h1 className="mb-4 text-3xl md:text-4xl font-extrabold text-primary dark:text-slate-100">
          Liabilities
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
          Tell us about your current debts and commitments. Expand the relevant sections and add entries as needed.
        </p>
      </header>

      {/* ── PHASE A: Current Liabilities ──────────────────────────────── */}
      <PhaseDivider
        phase="A"
        title="Current Liabilities"
        description="Loans, credit cards, and other financial commitments"
      />

      <div className="space-y-4 mb-10">

        {/* ── Mortgages ──────────────────────────────────────────────── */}
        <CollapsibleSection
          icon="home"
          title="Mortgages"
          badge={mortgages.items.length > 0 ? `${mortgages.items.length} added` : undefined}
          defaultOpen
        >
          <div className="p-4 md:p-8">
            {mortgages.items.length === 0 ? (
              <EmptyState icon="home" label="Mortgage" onAdd={mortgages.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Property Ref", "Lender", "Amount Owing", "Monthly", "Rate", "Ownership", ""]}>
                    {mortgages.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            mortgages.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{dash(e.propertyRef)}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dash(e.lender)}</td>
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{e.rate ? `${e.rate}%` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={mortgages.editingId} onToggleEdit={mortgages.toggleEdit} onRemove={mortgages.remove} /></td>
                        </tr>
                        {mortgages.editingId === e.id && (
                          <tr key={`${e.id}-edit`}>
                            <td colSpan={7} className="pb-4 pt-1">
                              <LiabilityEditForm entry={e} list={mortgages}
                                extraFields={
                                  <Field label="Property Reference">
                                    <input type="text" value={e.propertyRef}
                                      onChange={ev => mortgages.update(e.id, "propertyRef", ev.target.value)}
                                      className={inputCls} placeholder="e.g. 123 Smith St" />
                                  </Field>
                                }
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {mortgages.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={mortgages.editingId}
                      onToggleEdit={mortgages.toggleEdit} onRemove={mortgages.remove}
                      primary={e.propertyRef || e.lender || "Mortgage"}
                      secondary={[e.lender, e.amountOwing && `$${e.amountOwing} owing`, e.rate && `${e.rate}%`, e.monthlyRepayment && `$${e.monthlyRepayment}/mo`].filter(Boolean).join(" · ")}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={
                        <LiabilityEditForm entry={e} list={mortgages}
                          extraFields={
                            <Field label="Property Reference">
                              <input type="text" value={e.propertyRef}
                                onChange={ev => mortgages.update(e.id, "propertyRef", ev.target.value)}
                                className={inputCls} placeholder="e.g. 123 Smith St" />
                            </Field>
                          }
                        />
                      }
                    />
                  ))}
                </div>
                <AddButton label="Mortgage" onAdd={mortgages.add} />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* ── Personal Loans ─────────────────────────────────────────── */}
        <CollapsibleSection
          icon="account_balance"
          title="Personal Loans"
          badge={personalLoans.items.length > 0 ? `${personalLoans.items.length} added` : undefined}
        >
          <div className="p-4 md:p-8">
            {personalLoans.items.length === 0 ? (
              <EmptyState icon="account_balance" label="Personal Loan" onAdd={personalLoans.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Lender", "Amount Owing", "Monthly", "Rate", "Remaining Term", "Ownership", ""]}>
                    {personalLoans.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            personalLoans.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{dash(e.lender)}</td>
                          <td className="py-3.5 pr-4">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.rate ? `${e.rate}%` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dash(e.remainingTerm)}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={personalLoans.editingId} onToggleEdit={personalLoans.toggleEdit} onRemove={personalLoans.remove} /></td>
                        </tr>
                        {personalLoans.editingId === e.id && (
                          <tr key={`${e.id}-edit`}><td colSpan={7} className="pb-4 pt-1">
                            <LiabilityEditForm entry={e} list={personalLoans} />
                          </td></tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {personalLoans.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={personalLoans.editingId}
                      onToggleEdit={personalLoans.toggleEdit} onRemove={personalLoans.remove}
                      primary={e.lender || "Personal Loan"}
                      secondary={[e.amountOwing && `$${e.amountOwing} owing`, e.rate && `${e.rate}%`, e.monthlyRepayment && `$${e.monthlyRepayment}/mo`, e.remainingTerm].filter(Boolean).join(" · ")}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={<LiabilityEditForm entry={e} list={personalLoans} />}
                    />
                  ))}
                </div>
                <AddButton label="Personal Loan" onAdd={personalLoans.add} />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* ── Car Finance ────────────────────────────────────────────── */}
        <CollapsibleSection
          icon="directions_car"
          title="Car Finance"
          badge={carFinance.items.length > 0 ? `${carFinance.items.length} added` : undefined}
        >
          <div className="p-4 md:p-8">
            {carFinance.items.length === 0 ? (
              <EmptyState icon="directions_car" label="Car Finance" onAdd={carFinance.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Lender", "Amount Owing", "Monthly", "Rate", "Remaining Term", "Ownership", ""]}>
                    {carFinance.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            carFinance.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{dash(e.lender)}</td>
                          <td className="py-3.5 pr-4">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.rate ? `${e.rate}%` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dash(e.remainingTerm)}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={carFinance.editingId} onToggleEdit={carFinance.toggleEdit} onRemove={carFinance.remove} /></td>
                        </tr>
                        {carFinance.editingId === e.id && (
                          <tr key={`${e.id}-edit`}><td colSpan={7} className="pb-4 pt-1">
                            <LiabilityEditForm entry={e} list={carFinance} />
                          </td></tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {carFinance.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={carFinance.editingId}
                      onToggleEdit={carFinance.toggleEdit} onRemove={carFinance.remove}
                      primary={e.lender || "Car Finance"}
                      secondary={[e.amountOwing && `$${e.amountOwing} owing`, e.rate && `${e.rate}%`, e.monthlyRepayment && `$${e.monthlyRepayment}/mo`, e.remainingTerm].filter(Boolean).join(" · ")}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={<LiabilityEditForm entry={e} list={carFinance} />}
                    />
                  ))}
                </div>
                <AddButton label="Car Finance" onAdd={carFinance.add} />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* ── Credit Cards ───────────────────────────────────────────── */}
        <CollapsibleSection
          icon="credit_card"
          title="Credit Cards"
          badge={creditCards.items.length > 0 ? `${creditCards.items.length} added` : undefined}
        >
          <div className="p-4 md:p-8">
            {creditCards.items.length === 0 ? (
              <EmptyState icon="credit_card" label="Credit Card" onAdd={creditCards.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Lender", "Last 4 Digits", "Limit", "Amount Owing", "Monthly", "Ownership", ""]}>
                    {creditCards.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            creditCards.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{dash(e.lender)}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dash(e.bsb)}</td>
                          <td className="py-3.5 pr-4">{e.limit ? `$${e.limit}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={creditCards.editingId} onToggleEdit={creditCards.toggleEdit} onRemove={creditCards.remove} /></td>
                        </tr>
                        {creditCards.editingId === e.id && (
                          <tr key={`${e.id}-edit`}>
                            <td colSpan={7} className="pb-4 pt-1">
                              <EditFormWrapper onDone={() => creditCards.toggleEdit(e.id)}>
                                <Field label="Lender / Card Type">
                                  <input type="text" value={e.lender}
                                    onChange={ev => creditCards.update(e.id, "lender", ev.target.value)}
                                    className={inputCls} placeholder="e.g. Visa – CommBank" />
                                </Field>
                                <Field label="Last 4 Digits">
                                  <input type="text" maxLength={4} value={e.bsb}
                                    onChange={ev => creditCards.update(e.id, "bsb", ev.target.value)}
                                    className={inputCls} placeholder="e.g. 1234" />
                                </Field>
                                <Field label="Account #">
                                  <input type="text" value={e.acct}
                                    onChange={ev => creditCards.update(e.id, "acct", ev.target.value)}
                                    className={inputCls} />
                                </Field>
                                <Field label="Credit Limit">
                                  <CurrencyInput value={e.limit} onChange={v => creditCards.update(e.id, "limit", v)} />
                                </Field>
                                <Field label="Amount Owing">
                                  <CurrencyInput value={e.amountOwing} onChange={v => creditCards.update(e.id, "amountOwing", v)} />
                                </Field>
                                <Field label="Monthly Repayment">
                                  <CurrencyInput value={e.monthlyRepayment} onChange={v => creditCards.update(e.id, "monthlyRepayment", v)} />
                                </Field>
                                <Field label="Clearing / Refinance">
                                  <ClearingField value={e.clearing} onChange={v => creditCards.update(e.id, "clearing", v)} />
                                </Field>
                                <Field label="Interest Rate (%)">
                                  <input type="text" value={e.rate}
                                    onChange={ev => creditCards.update(e.id, "rate", ev.target.value)}
                                    className={inputCls} placeholder="e.g. 19.99" />
                                </Field>
                                <Field label="Expiry Date">
                                  <input type="text" value={e.remainingTerm}
                                    onChange={ev => creditCards.update(e.id, "remainingTerm", ev.target.value)}
                                    className={inputCls} placeholder="e.g. 09/27" />
                                </Field>
                                <Field label="Ownership">
                                  <OwnershipField
                                    app1={e.ownerApp1} app2={e.ownerApp2}
                                    onChangeApp1={v => creditCards.update(e.id, "ownerApp1", v)}
                                    onChangeApp2={v => creditCards.update(e.id, "ownerApp2", v)}
                                  />
                                </Field>
                              </EditFormWrapper>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {creditCards.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={creditCards.editingId}
                      onToggleEdit={creditCards.toggleEdit} onRemove={creditCards.remove}
                      primary={e.lender || "Credit Card"}
                      secondary={[e.bsb && `···${e.bsb}`, e.limit && `Limit $${e.limit}`, e.amountOwing && `$${e.amountOwing} owing`, e.monthlyRepayment && `$${e.monthlyRepayment}/mo`].filter(Boolean).join(" · ")}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={
                        <EditFormWrapper onDone={() => creditCards.toggleEdit(e.id)}>
                          <Field label="Lender / Card Type">
                            <input type="text" value={e.lender} onChange={ev => creditCards.update(e.id, "lender", ev.target.value)} className={inputCls} placeholder="e.g. Visa – CommBank" />
                          </Field>
                          <Field label="Last 4 Digits">
                            <input type="text" maxLength={4} value={e.bsb} onChange={ev => creditCards.update(e.id, "bsb", ev.target.value)} className={inputCls} placeholder="e.g. 1234" />
                          </Field>
                          <Field label="Account #">
                            <input type="text" value={e.acct} onChange={ev => creditCards.update(e.id, "acct", ev.target.value)} className={inputCls} />
                          </Field>
                          <Field label="Credit Limit">
                            <CurrencyInput value={e.limit} onChange={v => creditCards.update(e.id, "limit", v)} />
                          </Field>
                          <Field label="Amount Owing">
                            <CurrencyInput value={e.amountOwing} onChange={v => creditCards.update(e.id, "amountOwing", v)} />
                          </Field>
                          <Field label="Monthly Repayment">
                            <CurrencyInput value={e.monthlyRepayment} onChange={v => creditCards.update(e.id, "monthlyRepayment", v)} />
                          </Field>
                          <Field label="Clearing / Refinance">
                            <ClearingField value={e.clearing} onChange={v => creditCards.update(e.id, "clearing", v)} />
                          </Field>
                          <Field label="Interest Rate (%)">
                            <input type="text" value={e.rate} onChange={ev => creditCards.update(e.id, "rate", ev.target.value)} className={inputCls} placeholder="e.g. 19.99" />
                          </Field>
                          <Field label="Expiry Date">
                            <input type="text" value={e.remainingTerm} onChange={ev => creditCards.update(e.id, "remainingTerm", ev.target.value)} className={inputCls} placeholder="e.g. 09/27" />
                          </Field>
                          <Field label="Ownership">
                            <OwnershipField app1={e.ownerApp1} app2={e.ownerApp2} onChangeApp1={v => creditCards.update(e.id, "ownerApp1", v)} onChangeApp2={v => creditCards.update(e.id, "ownerApp2", v)} />
                          </Field>
                        </EditFormWrapper>
                      }
                    />
                  ))}
                </div>
                <AddButton label="Credit Card" onAdd={creditCards.add} />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* ── HECS / HELP ────────────────────────────────────────────── */}
        <CollapsibleSection
          icon="school"
          title="HECS / HELP"
          badge={hecsHelp.items.length > 0 ? `${hecsHelp.items.length} added` : undefined}
          optional
        >
          <div className="p-4 md:p-8">
            {hecsHelp.items.length === 0 ? (
              <EmptyState icon="school" label="HECS / HELP debt" onAdd={hecsHelp.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Amount Owing", "Monthly Repayment", "Ownership", ""]}>
                    {hecsHelp.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            hecsHelp.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={hecsHelp.editingId} onToggleEdit={hecsHelp.toggleEdit} onRemove={hecsHelp.remove} /></td>
                        </tr>
                        {hecsHelp.editingId === e.id && (
                          <tr key={`${e.id}-edit`}>
                            <td colSpan={4} className="pb-4 pt-1">
                              <EditFormWrapper onDone={() => hecsHelp.toggleEdit(e.id)}>
                                <Field label="Amount Owing">
                                  <CurrencyInput value={e.amountOwing} onChange={v => hecsHelp.update(e.id, "amountOwing", v)} />
                                </Field>
                                <Field label="Monthly Repayment">
                                  <CurrencyInput value={e.monthlyRepayment} onChange={v => hecsHelp.update(e.id, "monthlyRepayment", v)} />
                                </Field>
                                <Field label="Ownership">
                                  <OwnershipField
                                    app1={e.ownerApp1} app2={e.ownerApp2}
                                    onChangeApp1={v => hecsHelp.update(e.id, "ownerApp1", v)}
                                    onChangeApp2={v => hecsHelp.update(e.id, "ownerApp2", v)}
                                  />
                                </Field>
                              </EditFormWrapper>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {hecsHelp.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={hecsHelp.editingId}
                      onToggleEdit={hecsHelp.toggleEdit} onRemove={hecsHelp.remove}
                      primary={e.amountOwing ? `$${e.amountOwing} owing` : "HECS / HELP"}
                      secondary={e.monthlyRepayment ? `$${e.monthlyRepayment}/mo` : undefined}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={
                        <EditFormWrapper onDone={() => hecsHelp.toggleEdit(e.id)}>
                          <Field label="Amount Owing">
                            <CurrencyInput value={e.amountOwing} onChange={v => hecsHelp.update(e.id, "amountOwing", v)} />
                          </Field>
                          <Field label="Monthly Repayment">
                            <CurrencyInput value={e.monthlyRepayment} onChange={v => hecsHelp.update(e.id, "monthlyRepayment", v)} />
                          </Field>
                          <Field label="Ownership">
                            <OwnershipField app1={e.ownerApp1} app2={e.ownerApp2} onChangeApp1={v => hecsHelp.update(e.id, "ownerApp1", v)} onChangeApp2={v => hecsHelp.update(e.id, "ownerApp2", v)} />
                          </Field>
                        </EditFormWrapper>
                      }
                    />
                  ))}
                </div>
                <AddButton label="HECS / HELP Debt" onAdd={hecsHelp.add} />
              </>
            )}
          </div>
        </CollapsibleSection>

        {/* ── Other Liabilities ──────────────────────────────────────── */}
        <CollapsibleSection
          icon="receipt_long"
          title="Other Liabilities"
          badge={otherLiabs.items.length > 0 ? `${otherLiabs.items.length} added` : undefined}
          optional
        >
          <div className="p-4 md:p-8">
            {otherLiabs.items.length === 0 ? (
              <EmptyState icon="receipt_long" label="Other Liability" onAdd={otherLiabs.add} />
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden sm:block">
                  <SummaryTable headers={["Description", "Lender", "Amount Owing", "Monthly", "Ownership", ""]}>
                    {otherLiabs.items.map(e => (
                      <>
                        <tr
                          key={e.id}
                          className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${
                            otherLiabs.editingId === e.id ? "bg-primary/5 dark:bg-primary/10" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                          }`}
                        >
                          <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100 max-w-40 truncate">{dash(e.description)}</td>
                          <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">{dash(e.lender)}</td>
                          <td className="py-3.5 pr-4">{e.amountOwing ? `$${e.amountOwing}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4">{e.monthlyRepayment ? `$${e.monthlyRepayment}` : <span className="text-slate-400 italic">—</span>}</td>
                          <td className="py-3.5 pr-4"><OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} /></td>
                          <td className="py-3.5 pl-2"><RowActions id={e.id} editingId={otherLiabs.editingId} onToggleEdit={otherLiabs.toggleEdit} onRemove={otherLiabs.remove} /></td>
                        </tr>
                        {otherLiabs.editingId === e.id && (
                          <tr key={`${e.id}-edit`}>
                            <td colSpan={6} className="pb-4 pt-1">
                              <LiabilityEditForm entry={e} list={otherLiabs}
                                extraFields={
                                  <Field label="Description">
                                    <input type="text" value={e.description}
                                      onChange={ev => otherLiabs.update(e.id, "description", ev.target.value)}
                                      className={inputCls} placeholder="e.g. Tax debt" />
                                  </Field>
                                }
                              />
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </SummaryTable>
                </div>
                {/* Mobile cards */}
                <div className="sm:hidden space-y-3">
                  {otherLiabs.items.map(e => (
                    <MobileCard
                      key={e.id} id={e.id} editingId={otherLiabs.editingId}
                      onToggleEdit={otherLiabs.toggleEdit} onRemove={otherLiabs.remove}
                      primary={e.description || e.lender || "Other Liability"}
                      secondary={[e.lender, e.amountOwing && `$${e.amountOwing} owing`, e.monthlyRepayment && `$${e.monthlyRepayment}/mo`].filter(Boolean).join(" · ")}
                      badge={<OwnershipBadge app1={e.ownerApp1} app2={e.ownerApp2} />}
                      editForm={
                        <LiabilityEditForm entry={e} list={otherLiabs}
                          extraFields={
                            <Field label="Description">
                              <input type="text" value={e.description}
                                onChange={ev => otherLiabs.update(e.id, "description", ev.target.value)}
                                className={inputCls} placeholder="e.g. Tax debt" />
                            </Field>
                          }
                        />
                      }
                    />
                  ))}
                </div>
                <AddButton label="Other Liability" onAdd={otherLiabs.add} />
              </>
            )}
          </div>
        </CollapsibleSection>
      </div>

      {/* ── PHASE B: Other Items ──────────────────────────────────────── */}
      <PhaseDivider
        phase="B"
        title="Other Items"
        description="Retirement plans and exit strategy"
      />

      <div className="space-y-4 mb-10">
        <CollapsibleSection icon="lock" title="Retirement &amp; Exit Strategy" defaultOpen>
          <div className="p-4 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="li-retirement-app1" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Expected Retirement Age — Applicant 1
                </label>
                <input
                  id="li-retirement-app1"
                  type="number"
                  min={40}
                  max={99}
                  value={retirementApp1}
                  onChange={e => setRetirementApp1(e.target.value)}
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="li-retirement-app2" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Expected Retirement Age — Applicant 2
                </label>
                <input
                  id="li-retirement-app2"
                  type="number"
                  min={40}
                  max={99}
                  value={retirementApp2}
                  onChange={e => setRetirementApp2(e.target.value)}
                  className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="li-exit-strategy" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Exit Strategy
              </label>
              <textarea
                id="li-exit-strategy"
                rows={3}
                value={exitStrategy}
                onChange={e => setExitStrategy(e.target.value)}
                placeholder="Describe the borrower's planned exit strategy…"
                className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* ── PHASE C: Credit History ───────────────────────────────────── */}
      <PhaseDivider
        phase="C"
        title="Credit History"
        description="Adverse credit events for each applicant"
      />

      <div className="space-y-4 mb-10">
        <CollapsibleSection icon="history" title="Credit History" defaultOpen>
          <div className="p-4 md:p-8">
            {/* Mobile stacked layout */}
            <div className="sm:hidden space-y-4">
              {[
                { field: "defaults"   as const, label: "Have you ever had any defaults, financial judgments, or legal proceedings against you?" },
                { field: "difficulty" as const, label: "Are you having difficulty meeting your financial commitments?" },
                { field: "arrears"    as const, label: "Are any existing debts currently in arrears?" },
              ].map((q, i, arr) => (
                <div key={q.field} className={i < arr.length - 1 ? "pb-4 border-b border-slate-100 dark:border-slate-700" : ""}>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-snug mb-3">{q.label}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">App. 1</p>
                      <RadioGroup name={`credit-${q.field}-app1`} value={credit[q.field][0]}
                        onChange={v => updateCredit(q.field, 0, v as YesNoNA)}
                        options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "N/A", value: "na" }]} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">App. 2</p>
                      <RadioGroup name={`credit-${q.field}-app2`} value={credit[q.field][1]}
                        onChange={v => updateCredit(q.field, 1, v as YesNoNA)}
                        options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "N/A", value: "na" }]} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Desktop table */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700">
                    <th className="text-left pb-3 pr-6 font-semibold text-slate-700 dark:text-slate-300 text-sm">Question</th>
                    <th className="pb-3 px-8 font-semibold text-slate-700 dark:text-slate-300 text-sm text-center">Applicant 1</th>
                    <th className="pb-3 px-8 font-semibold text-slate-700 dark:text-slate-300 text-sm text-center">Applicant 2</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {[
                    { field: "defaults"   as const, label: "Have you ever had any defaults, financial judgments, or legal proceedings against you?" },
                    { field: "difficulty" as const, label: "Are you having difficulty meeting your financial commitments?" },
                    { field: "arrears"    as const, label: "Are any existing debts currently in arrears?" },
                  ].map(q => (
                    <tr key={q.field}>
                      <td className="py-4 pr-6 text-sm text-slate-700 dark:text-slate-300 leading-snug">{q.label}</td>
                      <td className="py-4 px-8">
                        <RadioGroup name={`credit-${q.field}-app1`} value={credit[q.field][0]}
                          onChange={v => updateCredit(q.field, 0, v as YesNoNA)}
                          options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "N/A", value: "na" }]} />
                      </td>
                      <td className="py-4 px-8">
                        <RadioGroup name={`credit-${q.field}-app2`} value={credit[q.field][1]}
                          onChange={v => updateCredit(q.field, 1, v as YesNoNA)}
                          options={[{ label: "Yes", value: "yes" }, { label: "No", value: "no" }, { label: "N/A", value: "na" }]} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex flex-col gap-1.5">
              <label htmlFor="li-credit-details" className="text-sm font-semibold italic text-slate-600 dark:text-slate-400">
                If yes to any of the above, please provide further details
              </label>
              <textarea
                id="li-credit-details"
                rows={3}
                value={credit.details}
                onChange={e => setCredit(p => ({ ...p, details: e.target.value }))}
                className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          </div>
        </CollapsibleSection>
      </div>

      {/* ── PHASE D: Protecting Lifestyle & Assets ────────────────────── */}
      <PhaseDivider
        phase="D"
        title="Protecting Lifestyle &amp; Assets"
        description="Insurance review and lifestyle protection"
      />

      <div className="space-y-4 mb-12">
        <CollapsibleSection icon="security" title="Insurance Review" defaultOpen>
          <div className="p-4 md:p-8 space-y-5">
            {[
              { key: "reviewedInsurance", label: "Have you reviewed your personal risk insurance requirements in the last 12 months?" },
              { key: "sufficientLife",    label: "Do you have sufficient life insurance to cover, as a minimum, your existing and proposed debts?" },
              { key: "incomeProtection",  label: "If your income reduces, due to illness or injury, do you have the insurance to cover your loan?" },
            ].map(q => (
              <InsuranceRow key={q.key} label={q.label} name={q.key}
                value={(ins[q.key] ?? "") as YesNoNS} onChange={v => setInsField(q.key, v)} />
            ))}

            <div className="pt-1">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Are you sure your existing insurance is adequate for:
              </p>
              <div className="ml-2 sm:ml-5 space-y-3 border-l-2 border-slate-100 dark:border-slate-700 pl-3 sm:pl-4">
                {[
                  { key: "homeBuilding", label: "Home building and contents" },
                  { key: "motorVehicle", label: "Motor vehicle" },
                  { key: "landlord",     label: "Landlord protection" },
                  { key: "boatCaravan",  label: "Boat or caravan" },
                  { key: "commercial",   label: "Commercial insurance" },
                ].map(q => (
                  <InsuranceRow key={q.key} label={q.label} name={q.key}
                    value={(ins[q.key] ?? "") as YesNoNS} onChange={v => setInsField(q.key, v)} />
                ))}
              </div>
            </div>

            <InsuranceRow
              label="I wish to pursue a free and non-obligation consultation to discuss my insurance needs (Allianz)"
              name="allianz" value={(ins.allianz ?? "") as YesNoNS} onChange={v => setInsField("allianz", v)} />
            <InsuranceRow
              label="I wish to pursue a free and non-obligation consultation to discuss my home connection needs, such as internet, electricity, gas, etc. (Smart Select)"
              name="smartSelect" value={(ins.smartSelect ?? "") as YesNoNS} onChange={v => setInsField("smartSelect", v)} />
          </div>
        </CollapsibleSection>
      </div>

      {/* Need Help — mobile only (above nav) */}
      <div className="mt-3 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700 md:hidden">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you&apos;re unsure about any details, you can save your progress and return later.
              Your mortgage broker will also review all information during your consultation.
            </p>
          </div>
        </div>
      </div>

      {/* ── Navigation ──────────────────────────────────────────────────── */}
      {/* Mobile */}
      <div className="sticky bottom-0 z-10 mt-6 flex flex-col gap-3 bg-background-light py-4 dark:bg-background-dark md:hidden">
        <Link href="/living-expenses"
          onClick={!isSubmitted ? (e) => { e.preventDefault(); handleSave("/living-expenses"); } : undefined}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-primary/90">
          {isSaving ? "Saving…" : "Next: Living Expenses"}
          <span className="material-symbols-outlined text-[20px]">chevron_right</span>
        </Link>
        <div className="grid grid-cols-2 gap-3">
          <Link href="/assets" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
            Previous Step
          </Link>
          <button type="button" onClick={() => handleSave()} disabled={isSaving}
            className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 disabled:opacity-60">
            {isSaving ? "Saving…" : "Save Draft"}
          </button>
        </div>
      </div>
      {/* Desktop */}
      <div className="mt-12 hidden items-center justify-between border-t border-primary/10 pt-8 md:flex">
        <Link
          href="/assets"
          className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <div className="flex items-center gap-6">
          <button type="button" onClick={() => handleSave()} disabled={isSaving}
            className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400 disabled:opacity-60">
            {isSaving ? "Saving…" : "Save Draft"}
          </button>
          <Link href="/living-expenses"
            onClick={!isSubmitted ? (e) => { e.preventDefault(); handleSave("/living-expenses"); } : undefined}
            className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
            {isSaving ? "Saving…" : "Next Step"}
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      {/* ── Need Help ───────────────────────────────────────────────────── */}
      <div className="mt-8 hidden bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700 md:block">
        <div className="flex gap-4">
          <span className="material-symbols-outlined text-primary mt-0.5">info</span>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              If you&apos;re unsure about any details, you can save your progress and return later.
              Your mortgage broker will also review all information during your consultation.
            </p>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

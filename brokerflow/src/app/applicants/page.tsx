"use client";

import { PageShell } from "@/components/PageShell";
import { useApplicants, ApplicantRole } from "@/context/applicants";
import Link from "next/link";
import { useState } from "react";

const ROLE_OPTIONS: { value: ApplicantRole; icon: string; description: string }[] = [
  { value: "Spouse / Partner",   icon: "favorite",         description: "Jointly responsible" },
  { value: "Business Partner",   icon: "business_center",  description: "Commercial interest"  },
  { value: "Co-Borrower",        icon: "group_add",        description: "Friend or relative"   },
];

export default function ApplicantsPage() {
  const { applicants, addApplicant, removeApplicant, updateApplicant } = useApplicants();

  const [showAddForm, setShowAddForm]   = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName]   = useState("");
  const [newRole, setNewRole]           = useState<ApplicantRole>("Spouse / Partner");
  const [editingId, setEditingId]       = useState<string | null>(null);

  const confirmAdd = () => {
    if (!newFirstName.trim()) return;
    addApplicant({ firstName: newFirstName.trim(), lastName: newLastName.trim(), role: newRole });
    setNewFirstName("");
    setNewLastName("");
    setNewRole("Spouse / Partner");
    setShowAddForm(false);
  };

  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 1 of 6
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
          Applicants
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Add all individuals involved in this mortgage application. Each applicant will have their
          own Personal Details and Employment sections in the next steps.
        </p>
      </header>

      <div className="flex flex-col gap-8">

        {/* Current applicants list */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Current Applicants</h3>
            {!showAddForm && (
              <button
                type="button"
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 rounded-lg border-2 border-primary px-4 py-2 text-sm font-bold text-primary transition-colors hover:bg-primary/10"
              >
                <span className="material-symbols-outlined text-lg">person_add</span>
                Add Another Applicant
              </button>
            )}
          </div>

          <div className="grid gap-4">
            {applicants.map((a, i) => {
              const label = [a.firstName, a.lastName].filter(Boolean).join(" ") || `Applicant ${i + 1}`;
              const isEditing = editingId === a.id;

              return (
                <div key={a.id} className="rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 overflow-hidden">
                  <div className={`flex items-center justify-between p-6 ${a.isPrimary ? "" : "border-l-4 border-l-primary"}`}>
                    <div className="flex items-center gap-4">
                      <div className={`flex size-12 items-center justify-center rounded-full text-2xl ${
                        a.isPrimary ? "bg-primary/10 text-primary" : "bg-slate-100 text-slate-500 dark:bg-slate-800"
                      }`}>
                        <span className="material-symbols-outlined">{a.isPrimary ? "person" : "person_outline"}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{label}</h4>
                        <p className="text-sm text-slate-500">{a.role}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setEditingId(isEditing ? null : a.id)}
                        className="flex size-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        <span className="material-symbols-outlined">{isEditing ? "close" : "edit"}</span>
                      </button>
                      <button
                        type="button"
                        disabled={a.isPrimary}
                        onClick={() => removeApplicant(a.id)}
                        className={`flex size-9 items-center justify-center rounded-lg ${
                          a.isPrimary
                            ? "cursor-not-allowed text-slate-300"
                            : "text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                        }`}
                        title={a.isPrimary ? "Primary applicant cannot be removed" : "Remove applicant"}
                      >
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>

                  {/* Inline edit */}
                  {isEditing && (
                    <div className="border-t border-slate-100 dark:border-slate-700 bg-primary/5 dark:bg-primary/10 p-5">
                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Edit Applicant</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">First Name</label>
                          <input
                            type="text"
                            value={a.firstName}
                            onChange={e => updateApplicant(a.id, { firstName: e.target.value })}
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                            placeholder="Legal first name"
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Last Name</label>
                          <input
                            type="text"
                            value={a.lastName}
                            onChange={e => updateApplicant(a.id, { lastName: e.target.value })}
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                            placeholder="Legal last name"
                          />
                        </div>
                      </div>
                      {!a.isPrimary && (
                        <div className="flex flex-col gap-1.5 mb-4">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Role</label>
                          <div className="flex flex-wrap gap-3">
                            {ROLE_OPTIONS.map(opt => (
                              <label key={opt.value} className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                                a.role === opt.value
                                  ? "border-primary bg-primary/10 font-semibold text-primary"
                                  : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                              }`}>
                                <input
                                  type="radio"
                                  name={`role-${a.id}`}
                                  value={opt.value}
                                  checked={a.role === opt.value}
                                  onChange={() => updateApplicant(a.id, { role: opt.value })}
                                  className="sr-only"
                                />
                                <span className="material-symbols-outlined text-[16px]">{opt.icon}</span>
                                {opt.value}
                              </label>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">check</span>
                          Done
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Add new applicant form */}
        {showAddForm && (
          <div className="flex flex-col gap-6 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 p-8 dark:bg-slate-800/50">
            <div className="space-y-2 text-center flex flex-col items-center">
              <h3 className="text-xl font-bold text-primary dark:text-white">Adding a new applicant</h3>
              <p className="max-w-md text-slate-600 dark:text-slate-400">
                Select the relationship type, then enter their name.
              </p>
            </div>

            {/* Role picker */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
              {ROLE_OPTIONS.map(opt => (
                <label
                  key={opt.value}
                  className={`relative flex cursor-pointer flex-col rounded-xl border p-4 transition-all ${
                    newRole === opt.value
                      ? "border-primary bg-white shadow dark:bg-slate-900"
                      : "border-slate-200 bg-white hover:border-primary dark:border-slate-800 dark:bg-slate-900"
                  }`}
                >
                  <input
                    className="absolute right-4 top-4 h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                    name="new-relationship"
                    type="radio"
                    checked={newRole === opt.value}
                    onChange={() => setNewRole(opt.value)}
                  />
                  <span className="material-symbols-outlined mb-2 text-3xl text-primary">{opt.icon}</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{opt.value}</span>
                  <span className="text-xs text-slate-500">{opt.description}</span>
                </label>
              ))}
            </div>

            {/* Name fields */}
            <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-first-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="new-first-name"
                  type="text"
                  value={newFirstName}
                  onChange={e => setNewFirstName(e.target.value)}
                  className="rounded border-slate-300 bg-white focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Legal first name"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="new-last-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Last Name
                </label>
                <input
                  id="new-last-name"
                  type="text"
                  value={newLastName}
                  onChange={e => setNewLastName(e.target.value)}
                  className="rounded border-slate-300 bg-white focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800"
                  placeholder="Legal last name"
                />
              </div>
            </div>

            <div className="flex w-full justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => { setShowAddForm(false); setNewFirstName(""); setNewLastName(""); }}
                className="rounded px-6 py-2.5 font-bold text-slate-700 transition-colors hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmAdd}
                disabled={!newFirstName.trim()}
                className="rounded bg-primary px-8 py-2.5 font-bold text-white shadow transition-shadow hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm Applicant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5"
        >
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <Link
          href="/personal-details"
          className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90"
        >
          Next Step
          <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
        </Link>
      </div>
    </PageShell>
  );
}

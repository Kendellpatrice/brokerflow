"use client";

import { PageShell } from "@/components/PageShell";
import { CurrencyInput } from "@/components/CurrencyInput";
import { CollapsibleSection } from "@/components/CollapsibleSection";
import { PhaseDivider } from "@/components/PhaseDivider";
import Link from "next/link";
import { useState } from "react";

export default function AssetsPage() {
  // ── Properties ──────────────────────────────────────────────────────────
  interface Property {
    id: number;
    address: string;
    propertyType: string;
    estimatedValue: string;
    rentalIncome: string;
    lender: string;
    mortgageNumber: string;
    ownerApp1: boolean;
    ownerApp2: boolean;
  }

  const blankProperty = (id: number): Property => ({
    id,
    address: "",
    propertyType: "",
    estimatedValue: "",
    rentalIncome: "",
    lender: "",
    mortgageNumber: "",
    ownerApp1: false,
    ownerApp2: false,
  });

  const [properties, setProperties] = useState<Property[]>([]);
  const [editingPropertyId, setEditingPropertyId] = useState<number | null>(null);

  const addProperty = () => {
    const newProp = blankProperty(Date.now());
    setProperties((prev) => [...prev, newProp]);
    setEditingPropertyId(newProp.id);
  };

  const removeProperty = (id: number) => {
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (editingPropertyId === id) setEditingPropertyId(null);
  };

  const updateProperty = (id: number, field: keyof Property, value: string | boolean) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // ── Bank Accounts ──────────────────────────────────────────────────────────
  interface BankAccount {
    id: number;
    institution: string;
    accountType: string;
    balance: string;
    bsb: string;
    accountNumber: string;
    ownerApp1: boolean;
    ownerApp2: boolean;
  }
  const blankBankAccount = (id: number): BankAccount => ({
    id, institution: "", accountType: "", balance: "", bsb: "", accountNumber: "", ownerApp1: false, ownerApp2: false,
  });
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [editingBankAccountId, setEditingBankAccountId] = useState<number | null>(null);
  const addBankAccount = () => {
    const n = blankBankAccount(Date.now());
    setBankAccounts((p) => [...p, n]);
    setEditingBankAccountId(n.id);
  };
  const removeBankAccount = (id: number) => {
    setBankAccounts((p) => p.filter((a) => a.id !== id));
    if (editingBankAccountId === id) setEditingBankAccountId(null);
  };
  const updateBankAccount = (id: number, field: keyof BankAccount, value: string | boolean) =>
    setBankAccounts((p) => p.map((a) => (a.id === id ? { ...a, [field]: value } : a)));

  // ── Vehicles ────────────────────────────────────────────────────────────────
  interface Vehicle {
    id: number;
    makeModel: string;
    year: string;
    estimatedValue: string;
    lender: string;
    ownerApp1: boolean;
    ownerApp2: boolean;
  }
  const blankVehicle = (id: number): Vehicle => ({
    id, makeModel: "", year: "", estimatedValue: "", lender: "", ownerApp1: false, ownerApp2: false,
  });
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [editingVehicleId, setEditingVehicleId] = useState<number | null>(null);
  const addVehicle = () => {
    const n = blankVehicle(Date.now());
    setVehicles((p) => [...p, n]);
    setEditingVehicleId(n.id);
  };
  const removeVehicle = (id: number) => {
    setVehicles((p) => p.filter((v) => v.id !== id));
    if (editingVehicleId === id) setEditingVehicleId(null);
  };
  const updateVehicle = (id: number, field: keyof Vehicle, value: string | boolean) =>
    setVehicles((p) => p.map((v) => (v.id === id ? { ...v, [field]: value } : v)));

  // ── Superannuation ──────────────────────────────────────────────────────────
  interface SuperFund {
    id: number;
    fundName: string;
    memberNumber: string;
    balance: string;
    ownerApp1: boolean;
    ownerApp2: boolean;
  }
  const blankSuperFund = (id: number): SuperFund => ({
    id, fundName: "", memberNumber: "", balance: "", ownerApp1: false, ownerApp2: false,
  });
  const [superFunds, setSuperFunds] = useState<SuperFund[]>([]);
  const [editingSuperFundId, setEditingSuperFundId] = useState<number | null>(null);
  const addSuperFund = () => {
    const n = blankSuperFund(Date.now());
    setSuperFunds((p) => [...p, n]);
    setEditingSuperFundId(n.id);
  };
  const removeSuperFund = (id: number) => {
    setSuperFunds((p) => p.filter((s) => s.id !== id));
    if (editingSuperFundId === id) setEditingSuperFundId(null);
  };
  const updateSuperFund = (id: number, field: keyof SuperFund, value: string | boolean) =>
    setSuperFunds((p) => p.map((s) => (s.id === id ? { ...s, [field]: value } : s)));

  // ── Other Assets ────────────────────────────────────────────────────────────
  interface OtherAsset {
    id: number;
    description: string;
    estimatedValue: string;
    ownerApp1: boolean;
    ownerApp2: boolean;
  }
  const blankOtherAsset = (id: number): OtherAsset => ({
    id, description: "", estimatedValue: "", ownerApp1: false, ownerApp2: false,
  });
  const [otherAssets, setOtherAssets] = useState<OtherAsset[]>([]);
  const [editingOtherAssetId, setEditingOtherAssetId] = useState<number | null>(null);
  const addOtherAsset = () => {
    const n = blankOtherAsset(Date.now());
    setOtherAssets((p) => [...p, n]);
    setEditingOtherAssetId(n.id);
  };
  const removeOtherAsset = (id: number) => {
    setOtherAssets((p) => p.filter((o) => o.id !== id));
    if (editingOtherAssetId === id) setEditingOtherAssetId(null);
  };
  const updateOtherAsset = (id: number, field: keyof OtherAsset, value: string | boolean) =>
    setOtherAssets((p) => p.map((o) => (o.id === id ? { ...o, [field]: value } : o)));



  return (
    <PageShell>

            {/* Page Header */}
            <header className="mb-10">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Step 4 of 6
              </span>
              <h1 className="mb-4 text-3xl sm:text-4xl font-extrabold text-primary dark:text-slate-100">
                Assets
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                Tell us about your assets. You can expand the sections that apply to you — feel free to skip any that are not relevant.
              </p>
            </header>

            {/* ── PHASE A: Transaction Details ──────────────────────────── */}
            <PhaseDivider
              phase="A"
              title="Transaction Details"
              description="Contact and funding information for this transaction"
            />

            <div className="space-y-4 mb-10">

              {/* Solicitor / Conveyancer Details */}
              <CollapsibleSection
                icon="gavel"
                title="Solicitor / Conveyancer Details"
                optional
              >
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="sol-firm" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Conveyancing Firm / Solicitor Company
                    </label>
                    <input
                      id="sol-firm"
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="sol-contact-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Contact Name
                    </label>
                    <input
                      id="sol-contact-name"
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="sol-contact-number" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Contact Number
                    </label>
                    <input
                      id="sol-contact-number"
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="tel"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="sol-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Email
                    </label>
                    <input
                      id="sol-email"
                      className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="email"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Valuation Contact */}
              <CollapsibleSection icon="search" title="Valuation Contact" optional>
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-x-8 gap-y-6 items-center text-sm">
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Owner/Occ / Refinances
                  </div>
                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Applicant 1</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Applicant 2</span>
                    </label>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label htmlFor="val-contact-ownocc" className="text-sm font-semibold text-slate-700 md:min-w-max dark:text-slate-300">
                      Contact Number
                    </label>
                    <input
                      id="val-contact-ownocc"
                      className="rounded w-full border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="tel"
                    />
                  </div>
                  <div className="font-semibold text-slate-800 dark:text-slate-200">
                    Purchases
                  </div>
                  <div className="flex flex-wrap gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        className="rounded text-primary focus:ring-primary border-slate-300"
                      />
                      <span className="text-slate-700 dark:text-slate-300">Solicitor above</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="rounded text-primary focus:ring-primary border-slate-300"
                        />
                        <span className="text-slate-700 dark:text-slate-300">Other</span>
                      </label>
                      <input
                        className="rounded border-slate-300 border-b-2 border-t-0 border-x-0 bg-transparent px-2 py-1 max-w-37.5 focus:ring-0 dark:border-slate-700 focus:border-primary"
                        type="text"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label htmlFor="val-contact-purchases" className="text-sm font-semibold text-slate-700 md:min-w-max dark:text-slate-300">
                      Contact Number
                    </label>
                    <input
                      id="val-contact-purchases"
                      className="rounded w-full border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      type="tel"
                    />
                  </div>
                </div>
              </CollapsibleSection>

              {/* Funds to Complete */}
              <CollapsibleSection
                icon="payments"
                title="Funds to Complete"
                defaultOpen
              >
                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-sm">
                  <p className="md:col-span-2 text-slate-500 dark:text-slate-400 text-sm -mt-2">
                    Where are you obtaining the funds you are contributing to this transaction?
                  </p>
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-4">
                    <label htmlFor="ftc-proceeds" className="font-semibold text-slate-800 dark:text-slate-200">
                      Proceeds of Property Sale
                    </label>
                    <CurrencyInput id="ftc-proceeds" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-4">
                    <label htmlFor="ftc-savings" className="font-semibold text-slate-800 dark:text-slate-200">
                      Savings
                    </label>
                    <CurrencyInput id="ftc-savings" />
                  </div>
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-4">
                    <label htmlFor="ftc-grant-amount" className="font-semibold text-slate-800 dark:text-slate-200">
                      Government Grant
                    </label>
                    <div className="flex gap-2">
                      <CurrencyInput id="ftc-grant-amount" className="flex-1 min-w-0" />
                      <input
                        id="ftc-grant-type"
                        type="text"
                        placeholder="Type"
                        className="w-1/2 rounded border-slate-300 min-w-0 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1.5 sm:grid sm:grid-cols-[1fr_1fr] sm:items-center sm:gap-4">
                    <label htmlFor="ftc-other-amount" className="font-semibold text-slate-800 dark:text-slate-200">
                      Other
                    </label>
                    <div className="flex gap-2">
                      <CurrencyInput id="ftc-other-amount" className="flex-1 min-w-0" />
                      <input
                        id="ftc-other-detail"
                        type="text"
                        placeholder="Detail"
                        className="w-1/2 rounded border-slate-300 min-w-0 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

            </div>

            {/* ── PHASE B: Your Assets ──────────────────────────────────── */}
            <PhaseDivider
              phase="B"
              title="Your Assets"
              description="Properties, accounts, vehicles, and other assets you own"
            />

            <div className="space-y-4 mb-12">

              {/* Properties */}
              <CollapsibleSection
                icon="home"
                title="Properties"
                badge={properties.length > 0 ? `${properties.length} added` : undefined}
                defaultOpen
              >
                <div className="p-4 sm:p-6 md:p-8">

                  {/* ── Empty state ── */}
                  {properties.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <span className="material-symbols-outlined text-slate-300 dark:text-slate-600 text-[48px] mb-3">home</span>
                      <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">
                        No properties added yet. Add your first property below.
                      </p>
                      <button
                        type="button"
                        onClick={addProperty}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add Property
                      </button>
                    </div>
                  )}

                  {/* ── Saved entries ── */}
                  {properties.length > 0 && (
                    <div>
                      {/* Mobile card list */}
                      <div className="sm:hidden flex flex-col gap-3 mb-4">
                        {properties.map((prop) => (
                          <div key={prop.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate capitalize">{prop.propertyType || <span className="text-slate-400 font-normal italic">No type</span>}</p>
                                <p className="text-sm text-slate-500 truncate">{prop.address || <span className="italic">No address</span>}</p>
                                <p className="text-sm text-slate-500">{prop.estimatedValue ? `$${prop.estimatedValue}` : ""}{prop.lender ? ` · ${prop.lender}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3 shrink-0">
                                <button type="button" title="Edit" onClick={() => setEditingPropertyId(editingPropertyId === prop.id ? null : prop.id)}
                                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${editingPropertyId === prop.id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
                                  <span className="material-symbols-outlined text-[18px]">{editingPropertyId === prop.id ? "close" : "edit"}</span>
                                </button>
                                <button type="button" title="Delete" onClick={() => removeProperty(prop.id)}
                                  className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            {editingPropertyId === prop.id && (
                              <div className="border-t border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
                                <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Edit Property Details</p>
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Address</label>
                                    <input type="text" placeholder="Enter full address..." value={prop.address} onChange={(e) => updateProperty(prop.id, "address", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Type</label>
                                      <select value={prop.propertyType} onChange={(e) => updateProperty(prop.id, "propertyType", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">Select...</option>
                                        <option value="house">House</option><option value="unit">Unit</option><option value="townhouse">Townhouse</option><option value="duplex">Duplex</option><option value="land">Land</option>
                                      </select>
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Est. Value</label>
                                      <input type="text" placeholder="e.g. 750000" value={prop.estimatedValue} onChange={(e) => updateProperty(prop.id, "estimatedValue", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rental (p/m)</label>
                                      <input type="text" placeholder="e.g. 2500" value={prop.rentalIncome} onChange={(e) => updateProperty(prop.id, "rentalIncome", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                                      <input type="text" placeholder="e.g. CommBank" value={prop.lender} onChange={(e) => updateProperty(prop.id, "lender", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mortgage #</label>
                                      <input type="text" placeholder="e.g. 1" value={prop.mortgageNumber} onChange={(e) => updateProperty(prop.id, "mortgageNumber", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                      <div className="flex gap-3 items-center h-[38px]">
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={prop.ownerApp1} onChange={(e) => updateProperty(prop.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">App. 1</span></label>
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={prop.ownerApp2} onChange={(e) => updateProperty(prop.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">App. 2</span></label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button type="button" onClick={() => setEditingPropertyId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check</span>Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-700">
                            <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4">Type</th>
                            <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4">Address</th>
                            <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4">Est. Value</th>
                            <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4">Lender</th>
                            <th className="pb-3 text-left text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 pr-4">Ownership</th>
                            <th className="pb-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {properties.map((prop) => (
                            <>
                              {/* ── Summary row ── */}
                              <tr
                                key={prop.id}
                                className={`border-b border-slate-100 dark:border-slate-700/60 transition-colors ${editingPropertyId === prop.id
                                  ? "bg-primary/5 dark:bg-primary/10"
                                  : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                                  }`}
                              >
                                <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100 capitalize">
                                  {prop.propertyType || <span className="text-slate-400 font-normal italic">—</span>}
                                </td>
                                <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300 max-w-[180px] truncate">
                                  {prop.address || <span className="text-slate-400 italic">—</span>}
                                </td>
                                <td className="py-3.5 pr-4 font-semibold text-slate-800 dark:text-slate-100">
                                  {prop.estimatedValue ? `$${prop.estimatedValue}` : <span className="text-slate-400 font-normal italic">—</span>}
                                </td>
                                <td className="py-3.5 pr-4 text-slate-600 dark:text-slate-300">
                                  {prop.lender || <span className="text-slate-400 italic">—</span>}
                                </td>
                                <td className="py-3.5 pr-4">
                                  {(prop.ownerApp1 || prop.ownerApp2) ? (
                                    <span className="inline-block rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                                      {prop.ownerApp1 && prop.ownerApp2 ? "Joint" : prop.ownerApp1 ? "App. 1" : "App. 2"}
                                    </span>
                                  ) : <span className="text-slate-400 italic text-xs">—</span>}
                                </td>
                                <td className="py-3.5 pl-2">
                                  <div className="flex items-center gap-2 justify-end">
                                    <button
                                      type="button"
                                      title="Edit"
                                      onClick={() =>
                                        setEditingPropertyId(editingPropertyId === prop.id ? null : prop.id)
                                      }
                                      className={`flex items-center justify-center rounded-lg p-1.5 transition-colors ${editingPropertyId === prop.id
                                        ? "bg-primary text-white"
                                        : "text-slate-400 hover:text-primary hover:bg-primary/10"
                                        }`}
                                    >
                                      <span className="material-symbols-outlined text-[16px]">
                                        {editingPropertyId === prop.id ? "close" : "edit"}
                                      </span>
                                    </button>
                                    <button
                                      type="button"
                                      title="Delete"
                                      onClick={() => removeProperty(prop.id)}
                                      className="flex items-center justify-center rounded-lg p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                    >
                                      <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>

                              {/* ── Inline edit form ── */}
                              {editingPropertyId === prop.id && (
                                <tr key={`${prop.id}-edit`}>
                                  <td colSpan={6} className="pb-4 pt-1">
                                    <div className="rounded-xl border border-primary/30 bg-primary/5 dark:bg-primary/10 dark:border-primary/20 p-5">
                                      <p className="text-xs font-bold uppercase tracking-wider text-primary mb-4">Edit Property Details</p>
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                          <label htmlFor={`prop-address-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Address</label>
                                          <input
                                            id={`prop-address-${prop.id}`}
                                            type="text"
                                            placeholder="Enter full address..."
                                            value={prop.address}
                                            onChange={(e) => updateProperty(prop.id, "address", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`prop-type-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Type</label>
                                          <select
                                            id={`prop-type-${prop.id}`}
                                            value={prop.propertyType}
                                            onChange={(e) => updateProperty(prop.id, "propertyType", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          >
                                            <option value="">Select type...</option>
                                            <option value="house">House</option>
                                            <option value="unit">Unit</option>
                                            <option value="townhouse">Townhouse</option>
                                            <option value="duplex">Duplex</option>
                                            <option value="land">Land</option>
                                          </select>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`prop-value-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                                          <input
                                            id={`prop-value-${prop.id}`}
                                            type="text"
                                            placeholder="e.g. 750000"
                                            value={prop.estimatedValue}
                                            onChange={(e) => updateProperty(prop.id, "estimatedValue", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`prop-rental-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rental Income (p/m)</label>
                                          <input
                                            id={`prop-rental-${prop.id}`}
                                            type="text"
                                            placeholder="e.g. 2500"
                                            value={prop.rentalIncome}
                                            onChange={(e) => updateProperty(prop.id, "rentalIncome", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`prop-lender-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                                          <input
                                            id={`prop-lender-${prop.id}`}
                                            type="text"
                                            placeholder="e.g. CommBank"
                                            value={prop.lender}
                                            onChange={(e) => updateProperty(prop.id, "lender", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`prop-mortgage-${prop.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Applicable Mortgage #</label>
                                          <input
                                            id={`prop-mortgage-${prop.id}`}
                                            type="text"
                                            placeholder="e.g. 1"
                                            value={prop.mortgageNumber}
                                            onChange={(e) => updateProperty(prop.id, "mortgageNumber", e.target.value)}
                                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                                          />
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                          <div className="flex gap-4 items-center h-[38px]">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={prop.ownerApp1}
                                                onChange={(e) => updateProperty(prop.id, "ownerApp1", e.target.checked)}
                                                className="rounded text-primary focus:ring-primary border-slate-300"
                                              />
                                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                              <input
                                                type="checkbox"
                                                checked={prop.ownerApp2}
                                                onChange={(e) => updateProperty(prop.id, "ownerApp2", e.target.checked)}
                                                className="rounded text-primary focus:ring-primary border-slate-300"
                                              />
                                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                                            </label>
                                          </div>
                                        </div>

                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <button
                                          type="button"
                                          onClick={() => setEditingPropertyId(null)}
                                          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                                        >
                                          <span className="material-symbols-outlined text-[16px]">check</span>
                                          Done
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>

                    </div>

                      {/* Add another button */}
                      <button
                        type="button"
                        onClick={addProperty}
                        className="mt-4 text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40"
                      >
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>
                        Add Another Property
                      </button>
                    </div>
                  )}

                </div>
              </CollapsibleSection>

              {/* Bank Accounts */}
              <CollapsibleSection
                icon="account_balance"
                title="Bank Accounts"
                badge={bankAccounts.length > 0 ? `${bankAccounts.length} added` : undefined}
                defaultOpen
              >
                <div className="p-4 sm:p-6 md:p-8">
                  {bankAccounts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-[48px] text-slate-300">account_balance</span>
                      <p className="text-sm">No bank accounts added yet. Add your first account below.</p>
                      <button
                        type="button"
                        onClick={addBankAccount}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>
                        Add Bank Account
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Mobile card list */}
                      <div className="sm:hidden flex flex-col gap-3 mb-4">
                        {bankAccounts.map((acc) => (
                          <div key={acc.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{acc.institution || <span className="text-slate-400 font-normal italic">No institution</span>}</p>
                                <p className="text-sm text-slate-500">{acc.accountType || <span className="italic">No type</span>}{acc.balance ? ` · $${acc.balance}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3 shrink-0">
                                <button type="button" onClick={() => setEditingBankAccountId(editingBankAccountId === acc.id ? null : acc.id)}
                                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${editingBankAccountId === acc.id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
                                  <span className="material-symbols-outlined text-[18px]">{editingBankAccountId === acc.id ? "close" : "edit"}</span>
                                </button>
                                <button type="button" onClick={() => removeBankAccount(acc.id)}
                                  className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            {editingBankAccountId === acc.id && (
                              <div className="border-t border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Institution</label>
                                      <input type="text" placeholder="e.g. CommBank" value={acc.institution} onChange={(e) => updateBankAccount(acc.id, "institution", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Type</label>
                                      <select value={acc.accountType} onChange={(e) => updateBankAccount(acc.id, "accountType", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm">
                                        <option value="">Select...</option>
                                        <option>Transaction</option><option>Saving</option><option>Pension</option><option>Term Deposit</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                                      <input type="text" placeholder="$0.00" value={acc.balance} onChange={(e) => updateBankAccount(acc.id, "balance", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">BSB</label>
                                      <input type="text" placeholder="e.g. 062-000" value={acc.bsb} onChange={(e) => updateBankAccount(acc.id, "bsb", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                                      <input type="text" placeholder="e.g. 12345678" value={acc.accountNumber} onChange={(e) => updateBankAccount(acc.id, "accountNumber", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                      <div className="flex gap-3 items-center h-[38px]">
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={acc.ownerApp1} onChange={(e) => updateBankAccount(acc.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 1</span></label>
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={acc.ownerApp2} onChange={(e) => updateBankAccount(acc.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 2</span></label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button type="button" onClick={() => setEditingBankAccountId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check</span>Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left pb-3 pr-4">Institution</th>
                            <th className="text-left pb-3 pr-4">Type</th>
                            <th className="text-left pb-3 pr-4">Balance</th>
                            <th className="text-left pb-3 pr-4">Ownership</th>
                            <th className="pb-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {bankAccounts.map((acc) => (
                            <>
                              <tr key={acc.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{acc.institution || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{acc.accountType || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{acc.balance ? `$${acc.balance}` : <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4">
                                  {[acc.ownerApp1 && "App. 1", acc.ownerApp2 && "App. 2"].filter(Boolean).map((o) => (
                                    <span key={o as string} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">{o}</span>
                                  ))}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2 justify-end">
                                    <button type="button" onClick={() => setEditingBankAccountId(editingBankAccountId === acc.id ? null : acc.id)} className="text-slate-400 hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">{editingBankAccountId === acc.id ? "close" : "edit"}</span>
                                    </button>
                                    <button type="button" onClick={() => removeBankAccount(acc.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {editingBankAccountId === acc.id && (
                                <tr key={`edit-${acc.id}`}>
                                  <td colSpan={5} className="pb-4 pt-1">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-slate-800/50 p-5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`bank-institution-${acc.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Financial Institution</label>
                                          <input id={`bank-institution-${acc.id}`} type="text" placeholder="e.g. CommBank" value={acc.institution} onChange={(e) => updateBankAccount(acc.id, "institution", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`bank-type-${acc.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Type</label>
                                          <select id={`bank-type-${acc.id}`} value={acc.accountType} onChange={(e) => updateBankAccount(acc.id, "accountType", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm">
                                            <option value="">Select type...</option>
                                            <option value="Transaction">Transaction</option>
                                            <option value="Saving">Saving</option>
                                            <option value="Pension">Pension</option>
                                            <option value="Term Deposit">Term Deposit</option>
                                          </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`bank-balance-${acc.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                                          <input id={`bank-balance-${acc.id}`} type="text" placeholder="$0.00" value={acc.balance} onChange={(e) => updateBankAccount(acc.id, "balance", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`bank-bsb-${acc.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">BSB</label>
                                          <input id={`bank-bsb-${acc.id}`} type="text" placeholder="e.g. 062-000" value={acc.bsb} onChange={(e) => updateBankAccount(acc.id, "bsb", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`bank-account-num-${acc.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                                          <input id={`bank-account-num-${acc.id}`} type="text" placeholder="e.g. 12345678" value={acc.accountNumber} onChange={(e) => updateBankAccount(acc.id, "accountNumber", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                          <div className="flex gap-4 items-center h-[38px]">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={acc.ownerApp1} onChange={(e) => updateBankAccount(acc.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={acc.ownerApp2} onChange={(e) => updateBankAccount(acc.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span></label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <button type="button" onClick={() => setEditingBankAccountId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">check</span>Done
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button type="button" onClick={addBankAccount} className="mt-4 text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>Add Another Bank Account
                      </button>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              {/* Vehicles */}
              <CollapsibleSection
                icon="directions_car"
                title="Vehicles"
                badge={vehicles.length > 0 ? `${vehicles.length} added` : undefined}
              >
                <div className="p-4 sm:p-6 md:p-8">
                  {vehicles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-[48px] text-slate-300">directions_car</span>
                      <p className="text-sm">No vehicles added yet. Add your first vehicle below.</p>
                      <button type="button" onClick={addVehicle} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>Add Vehicle
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Mobile card list */}
                      <div className="sm:hidden flex flex-col gap-3 mb-4">
                        {vehicles.map((v) => (
                          <div key={v.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{v.makeModel || <span className="text-slate-400 font-normal italic">No vehicle</span>}</p>
                                <p className="text-sm text-slate-500">{v.year || "—"}{v.estimatedValue ? ` · $${v.estimatedValue}` : ""}{v.lender ? ` · ${v.lender}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3 shrink-0">
                                <button type="button" onClick={() => setEditingVehicleId(editingVehicleId === v.id ? null : v.id)}
                                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${editingVehicleId === v.id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
                                  <span className="material-symbols-outlined text-[18px]">{editingVehicleId === v.id ? "close" : "edit"}</span>
                                </button>
                                <button type="button" onClick={() => removeVehicle(v.id)}
                                  className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            {editingVehicleId === v.id && (
                              <div className="border-t border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Make &amp; Model</label>
                                    <input type="text" placeholder="e.g. Toyota Camry" value={v.makeModel} onChange={(e) => updateVehicle(v.id, "makeModel", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Year</label>
                                      <input type="text" placeholder="e.g. 2021" value={v.year} onChange={(e) => updateVehicle(v.id, "year", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Est. Value</label>
                                      <input type="text" placeholder="$0.00" value={v.estimatedValue} onChange={(e) => updateVehicle(v.id, "estimatedValue", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                                      <input type="text" placeholder="e.g. CommBank" value={v.lender} onChange={(e) => updateVehicle(v.id, "lender", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                      <div className="flex gap-3 items-center h-[38px]">
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={v.ownerApp1} onChange={(e) => updateVehicle(v.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 1</span></label>
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={v.ownerApp2} onChange={(e) => updateVehicle(v.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 2</span></label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button type="button" onClick={() => setEditingVehicleId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check</span>Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left pb-3 pr-4">Make &amp; Model</th>
                            <th className="text-left pb-3 pr-4">Year</th>
                            <th className="text-left pb-3 pr-4">Est. Value</th>
                            <th className="text-left pb-3 pr-4">Lender</th>
                            <th className="text-left pb-3 pr-4">Ownership</th>
                            <th className="pb-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicles.map((v) => (
                            <>
                              <tr key={v.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{v.makeModel || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{v.year || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{v.estimatedValue ? `$${v.estimatedValue}` : <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{v.lender || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4">
                                  {[v.ownerApp1 && "App. 1", v.ownerApp2 && "App. 2"].filter(Boolean).map((o) => (
                                    <span key={o as string} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">{o}</span>
                                  ))}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2 justify-end">
                                    <button type="button" onClick={() => setEditingVehicleId(editingVehicleId === v.id ? null : v.id)} className="text-slate-400 hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">{editingVehicleId === v.id ? "close" : "edit"}</span>
                                    </button>
                                    <button type="button" onClick={() => removeVehicle(v.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {editingVehicleId === v.id && (
                                <tr key={`edit-${v.id}`}>
                                  <td colSpan={6} className="pb-4 pt-1">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-slate-800/50 p-5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                          <label htmlFor={`vehicle-make-${v.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Make &amp; Model</label>
                                          <input id={`vehicle-make-${v.id}`} type="text" placeholder="e.g. Toyota Camry" value={v.makeModel} onChange={(e) => updateVehicle(v.id, "makeModel", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`vehicle-year-${v.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Year</label>
                                          <input id={`vehicle-year-${v.id}`} type="text" placeholder="e.g. 2021" value={v.year} onChange={(e) => updateVehicle(v.id, "year", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`vehicle-value-${v.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                                          <input id={`vehicle-value-${v.id}`} type="text" placeholder="$0.00" value={v.estimatedValue} onChange={(e) => updateVehicle(v.id, "estimatedValue", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`vehicle-lender-${v.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                                          <input id={`vehicle-lender-${v.id}`} type="text" placeholder="e.g. CommBank" value={v.lender} onChange={(e) => updateVehicle(v.id, "lender", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                          <div className="flex gap-4 items-center h-[38px]">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={v.ownerApp1} onChange={(e) => updateVehicle(v.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={v.ownerApp2} onChange={(e) => updateVehicle(v.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span></label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <button type="button" onClick={() => setEditingVehicleId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">check</span>Done
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button type="button" onClick={addVehicle} className="mt-4 text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>Add Another Vehicle
                      </button>
                    </div>
                  )}
                </div>
              </CollapsibleSection>


              {/* Superannuation */}
              <CollapsibleSection
                icon="savings"
                title="Superannuation"
                badge={superFunds.length > 0 ? `${superFunds.length} added` : undefined}
              >
                <div className="p-4 sm:p-6 md:p-8">
                  {superFunds.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-[48px] text-slate-300">savings</span>
                      <p className="text-sm">No super funds added yet. Add your first fund below.</p>
                      <button type="button" onClick={addSuperFund} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>Add Super Fund
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Mobile card list */}
                      <div className="sm:hidden flex flex-col gap-3 mb-4">
                        {superFunds.map((s) => (
                          <div key={s.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{s.fundName || <span className="text-slate-400 font-normal italic">No fund</span>}</p>
                                <p className="text-sm text-slate-500">{s.memberNumber ? `Member #${s.memberNumber}` : "—"}{s.balance ? ` · $${s.balance}` : ""}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3 shrink-0">
                                <button type="button" onClick={() => setEditingSuperFundId(editingSuperFundId === s.id ? null : s.id)}
                                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${editingSuperFundId === s.id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
                                  <span className="material-symbols-outlined text-[18px]">{editingSuperFundId === s.id ? "close" : "edit"}</span>
                                </button>
                                <button type="button" onClick={() => removeSuperFund(s.id)}
                                  className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            {editingSuperFundId === s.id && (
                              <div className="border-t border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fund Name</label>
                                    <input type="text" placeholder="e.g. Australian Super" value={s.fundName} onChange={(e) => updateSuperFund(s.id, "fundName", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Member Number</label>
                                      <input type="text" placeholder="e.g. 123456789" value={s.memberNumber} onChange={(e) => updateSuperFund(s.id, "memberNumber", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                                      <input type="text" placeholder="$0.00" value={s.balance} onChange={(e) => updateSuperFund(s.id, "balance", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                    <div className="flex gap-3 items-center">
                                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={s.ownerApp1} onChange={(e) => updateSuperFund(s.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 1</span></label>
                                      <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={s.ownerApp2} onChange={(e) => updateSuperFund(s.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 2</span></label>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button type="button" onClick={() => setEditingSuperFundId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check</span>Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left pb-3 pr-4">Fund Name</th>
                            <th className="text-left pb-3 pr-4">Member #</th>
                            <th className="text-left pb-3 pr-4">Balance</th>
                            <th className="text-left pb-3 pr-4">Ownership</th>
                            <th className="pb-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {superFunds.map((s) => (
                            <>
                              <tr key={s.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{s.fundName || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{s.memberNumber || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{s.balance ? `$${s.balance}` : <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4">
                                  {[s.ownerApp1 && "App. 1", s.ownerApp2 && "App. 2"].filter(Boolean).map((o) => (
                                    <span key={o as string} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">{o}</span>
                                  ))}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2 justify-end">
                                    <button type="button" onClick={() => setEditingSuperFundId(editingSuperFundId === s.id ? null : s.id)} className="text-slate-400 hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">{editingSuperFundId === s.id ? "close" : "edit"}</span>
                                    </button>
                                    <button type="button" onClick={() => removeSuperFund(s.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {editingSuperFundId === s.id && (
                                <tr key={`edit-${s.id}`}>
                                  <td colSpan={5} className="pb-4 pt-1">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-slate-800/50 p-5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                          <label htmlFor={`super-fund-${s.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fund Name / Institution</label>
                                          <input id={`super-fund-${s.id}`} type="text" placeholder="e.g. Australian Super" value={s.fundName} onChange={(e) => updateSuperFund(s.id, "fundName", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`super-member-${s.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Member Number</label>
                                          <input id={`super-member-${s.id}`} type="text" placeholder="e.g. 123456789" value={s.memberNumber} onChange={(e) => updateSuperFund(s.id, "memberNumber", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`super-balance-${s.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                                          <input id={`super-balance-${s.id}`} type="text" placeholder="$0.00" value={s.balance} onChange={(e) => updateSuperFund(s.id, "balance", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                          <div className="flex gap-4 items-center h-[38px]">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={s.ownerApp1} onChange={(e) => updateSuperFund(s.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={s.ownerApp2} onChange={(e) => updateSuperFund(s.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span></label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <button type="button" onClick={() => setEditingSuperFundId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">check</span>Done
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button type="button" onClick={addSuperFund} className="mt-4 text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>Add Another Fund
                      </button>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              {/* Other Assets */}
              <CollapsibleSection
                icon="category"
                title="Other Assets"
                badge={otherAssets.length > 0 ? `${otherAssets.length} added` : undefined}
              >
                <div className="p-4 sm:p-6 md:p-8">
                  {otherAssets.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-slate-400 gap-3">
                      <span className="material-symbols-outlined text-[48px] text-slate-300">category</span>
                      <p className="text-sm">No other assets added yet. Add your first asset below.</p>
                      <button type="button" onClick={addOtherAsset} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                        <span className="material-symbols-outlined text-[18px]">add_circle</span>Add Asset
                      </button>
                    </div>
                  ) : (
                    <div>
                      {/* Mobile card list */}
                      <div className="sm:hidden flex flex-col gap-3 mb-4">
                        {otherAssets.map((o) => (
                          <div key={o.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{o.description || <span className="text-slate-400 font-normal italic">No description</span>}</p>
                                <p className="text-sm text-slate-500">{o.estimatedValue ? `$${o.estimatedValue}` : "—"}</p>
                              </div>
                              <div className="flex items-center gap-2 ml-3 shrink-0">
                                <button type="button" onClick={() => setEditingOtherAssetId(editingOtherAssetId === o.id ? null : o.id)}
                                  className={`flex size-9 items-center justify-center rounded-lg transition-colors ${editingOtherAssetId === o.id ? "bg-primary text-white" : "text-slate-400 hover:text-primary hover:bg-primary/10"}`}>
                                  <span className="material-symbols-outlined text-[18px]">{editingOtherAssetId === o.id ? "close" : "edit"}</span>
                                </button>
                                <button type="button" onClick={() => removeOtherAsset(o.id)}
                                  className="flex size-9 items-center justify-center rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                                  <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                              </div>
                            </div>
                            {editingOtherAssetId === o.id && (
                              <div className="border-t border-primary/20 bg-primary/5 dark:bg-primary/10 p-4">
                                <div className="grid grid-cols-1 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                                    <input type="text" placeholder="e.g. Jewellery, art, collectibles" value={o.description} onChange={(e) => updateOtherAsset(o.id, "description", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Est. Value</label>
                                      <input type="text" placeholder="$0.00" value={o.estimatedValue} onChange={(e) => updateOtherAsset(o.id, "estimatedValue", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                      <div className="flex gap-3 items-center h-[38px]">
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={o.ownerApp1} onChange={(e) => updateOtherAsset(o.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 1</span></label>
                                        <label className="flex items-center gap-1.5 cursor-pointer"><input type="checkbox" checked={o.ownerApp2} onChange={(e) => updateOtherAsset(o.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm">App. 2</span></label>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-4 flex justify-end">
                                  <button type="button" onClick={() => setEditingOtherAssetId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                    <span className="material-symbols-outlined text-[16px]">check</span>Done
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Desktop table */}
                      <div className="hidden sm:block">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-200 dark:border-slate-700">
                            <th className="text-left pb-3 pr-4">Description</th>
                            <th className="text-left pb-3 pr-4">Est. Value</th>
                            <th className="text-left pb-3 pr-4">Ownership</th>
                            <th className="pb-3 w-16"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {otherAssets.map((o) => (
                            <>
                              <tr key={o.id} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                                <td className="py-3 pr-4 font-medium text-slate-800 dark:text-slate-100">{o.description || <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{o.estimatedValue ? `$${o.estimatedValue}` : <span className="text-slate-400 italic">—</span>}</td>
                                <td className="py-3 pr-4">
                                  {[o.ownerApp1 && "App. 1", o.ownerApp2 && "App. 2"].filter(Boolean).map((ow) => (
                                    <span key={ow as string} className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full mr-1">{ow}</span>
                                  ))}
                                </td>
                                <td className="py-3">
                                  <div className="flex items-center gap-2 justify-end">
                                    <button type="button" onClick={() => setEditingOtherAssetId(editingOtherAssetId === o.id ? null : o.id)} className="text-slate-400 hover:text-primary transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">{editingOtherAssetId === o.id ? "close" : "edit"}</span>
                                    </button>
                                    <button type="button" onClick={() => removeOtherAsset(o.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                                      <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {editingOtherAssetId === o.id && (
                                <tr key={`edit-${o.id}`}>
                                  <td colSpan={4} className="pb-4 pt-1">
                                    <div className="rounded-xl border border-primary/20 bg-primary/5 dark:bg-slate-800/50 p-5">
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div className="flex flex-col gap-1.5 md:col-span-2">
                                          <label htmlFor={`other-desc-${o.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                                          <input id={`other-desc-${o.id}`} type="text" placeholder="e.g. Jewellery, art, collectibles" value={o.description} onChange={(e) => updateOtherAsset(o.id, "description", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label htmlFor={`other-value-${o.id}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                                          <input id={`other-value-${o.id}`} type="text" placeholder="$0.00" value={o.estimatedValue} onChange={(e) => updateOtherAsset(o.id, "estimatedValue", e.target.value)} className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                                          <div className="flex gap-4 items-center h-[38px]">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={o.ownerApp1} onChange={(e) => updateOtherAsset(o.id, "ownerApp1", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={o.ownerApp2} onChange={(e) => updateOtherAsset(o.id, "ownerApp2", e.target.checked)} className="rounded text-primary focus:ring-primary border-slate-300" /><span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span></label>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="mt-4 flex justify-end">
                                        <button type="button" onClick={() => setEditingOtherAssetId(null)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90 transition-colors">
                                          <span className="material-symbols-outlined text-[16px]">check</span>Done
                                        </button>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </>
                          ))}
                        </tbody>
                      </table>
                      </div>

                      <button type="button" onClick={addOtherAsset} className="mt-4 text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40">
                        <span className="material-symbols-outlined text-[20px]">add_circle</span>Add Another Asset
                      </button>
                    </div>
                  )}
                </div>
              </CollapsibleSection>

              {/* Shares & Investments */}
              <CollapsibleSection icon="show_chart" title="Shares &amp; Investments">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label htmlFor="shares-description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Description
                      </label>
                      <input
                        id="shares-description"
                        type="text"
                        placeholder="e.g. ASX shares, managed funds, ETFs"
                        className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="shares-value" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Estimated Value
                      </label>
                      <CurrencyInput id="shares-value" placeholder="$0.00" className="text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ownership
                      </label>
                      <div className="flex gap-4 items-center h-[38px]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Applicant 1
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Applicant 2
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

              {/* Home Contents */}
              <CollapsibleSection icon="chair" title="Home Contents">
                <div className="p-4 sm:p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label htmlFor="contents-description" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Description
                      </label>
                      <input
                        id="contents-description"
                        type="text"
                        placeholder="e.g. Furniture, appliances, personal belongings"
                        className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="contents-value" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Estimated Value
                      </label>
                      <CurrencyInput id="contents-value" placeholder="$0.00" className="text-sm" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        Ownership
                      </label>
                      <div className="flex gap-4 items-center h-[38px]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Applicant 1
                          </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            className="rounded text-primary focus:ring-primary border-slate-300"
                          />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            Applicant 2
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleSection>

            </div>

            {/* ── Navigation Buttons ────────────────────────────────────── */}
            {/* Mobile */}
            <div className="sticky bottom-0 z-10 mt-12 flex flex-col gap-3 border-t border-primary/10 bg-background-light px-4 py-4 dark:bg-background-dark md:hidden">
              <Link href="/liabilities" className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-6 py-4 text-base font-bold text-white shadow-lg transition-colors hover:bg-primary/90">
                Next: Liabilities
                <span className="material-symbols-outlined text-[20px]">chevron_right</span>
              </Link>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/employment-income" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Previous Step
                </Link>
                <button type="button" className="flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-bold text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  Save Draft
                </button>
              </div>
            </div>
            {/* Desktop */}
            <div className="mt-12 hidden items-center justify-between border-t border-primary/10 pt-8 md:flex">
              <Link
                href="/employment-income"
                className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <div className="flex items-center gap-6">
                <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">
                  Save Draft
                </span>
                <Link
                  href="/liabilities"
                  className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90"
                >
                  Next Step
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* ── Need Help Box ─────────────────────────────────────────── */}
            <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">
                    Need help?
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    If you&apos;re unsure about any details, you can save your progress and return
                    later. Your mortgage broker will also review all information during your
                    consultation.
                  </p>
                </div>
              </div>
            </div>

    </PageShell>
  );
}

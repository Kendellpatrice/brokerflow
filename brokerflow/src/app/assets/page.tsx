"use client";

import { SidebarNav } from "@/components/SidebarNav";
import { CurrencyInput } from "@/components/CurrencyInput";
import Link from "next/link";
import { useState } from "react";
/* eslint-disable @next/next/no-img-element */

export default function AssetsPage() {
  const [properties, setProperties] = useState([{ id: 1 }]);

  const addProperty = () => {
    setProperties([...properties, { id: Date.now() }]);
  };

  const removeProperty = (idToRemove: number) => {
    setProperties(properties.filter((prop) => prop.id !== idToRemove));
  };

  const [bankAccounts, setBankAccounts] = useState([{ id: 1 }]);

  const addBankAccount = () => {
    setBankAccounts([...bankAccounts, { id: Date.now() }]);
  };

  const removeBankAccount = (idToRemove: number) => {
    setBankAccounts(bankAccounts.filter((acc) => acc.id !== idToRemove));
  };

  const [vehicles, setVehicles] = useState([{ id: 1 }]);

  const addVehicle = () => {
    setVehicles([...vehicles, { id: Date.now() }]);
  };

  const removeVehicle = (idToRemove: number) => {
    setVehicles(vehicles.filter((v) => v.id !== idToRemove));
  };

  const [superFunds, setSuperFunds] = useState([{ id: 1 }]);

  const addSuperFund = () => {
    setSuperFunds([...superFunds, { id: Date.now() }]);
  };

  const removeSuperFund = (idToRemove: number) => {
    setSuperFunds(superFunds.filter((s) => s.id !== idToRemove));
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-clip">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-primary/10 bg-white px-6 py-4 dark:bg-background-dark md:px-20">
        <div className="flex items-center gap-3">
          <div className="text-primary dark:text-slate-100">
            <svg
              className="size-8"
              fill="none"
              viewBox="0 0 48 48"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M24 4C25.7818 14.2173 33.7827 22.2182 44 24C33.7827 25.7818 25.7818 33.7827 24 44C22.2182 33.7827 14.2173 25.7818 4 24C14.2173 22.2182 22.2182 14.2173 24 4Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-primary dark:text-slate-100">
            uBroker
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden text-sm font-medium text-slate-600 dark:text-slate-400 md:block">
            Client: James &amp; Sarah Smith
          </span>
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-full border border-primary/20 bg-primary/10">
            <img
              alt="Profile"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVTiH53nUWx2K08UJP04ET2KL0-kTlCzir8zZw3rNoV69RM2CUxestGhNa4A5ahcP819A5L4vFfKg1v6kPO58N0txgYEZ4mzHT4Tz_enrMUAug9t35ueraB-RtasfUOl7vHSF14QreLtZAfPIuEiwXikpuOGca7aU-qopaMCx8qOHXO_c3ancY66m-_tAwyDNZIfHP7hNypGTPsJ6lEUZDplwTXA8MVYXQao1Ifc7RiGm8_9ekTjbeGNlwtVzGCiF6fZ1_CajXQYRZ"
            />
          </div>
        </div>
      </header>

      <main className="flex w-full flex-grow flex-col md:flex-row">
        <SidebarNav />

        {/* Form Content */}
        <section className="flex-1 overflow-y-auto bg-background-light p-6 dark:bg-background-dark md:p-12">
          <div className="mx-auto max-w-5xl">
            <header className="mb-10">
              <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Step 4 of 6
              </span>
              <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
                Assets
              </h1>
              <p className="text-slate-600 dark:text-slate-400 max-w-3xl">
                Please provide details regarding solicitor and conveyancer details, valuation contacts, funds to complete, and your current assets including properties, bank accounts, and investments.
              </p>
            </header>

            {/* Solicitor / Conveyancer Details */}
            <div className="mb-8">
              <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3 flex items-center justify-between">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Solicitor / Conveyancer Details</h2>
                  <span className="text-white/80 text-xs italic">If known</span>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Conveyancing Firm / Solicitor Company</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Number</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="email" />
                  </div>
                </div>
              </div>
            </div>

            {/* Valuation Contact */}
            <div className="mb-8">
              <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Valuation Contact</h2>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-x-8 gap-y-6 items-center">

                  {/* Row 1 */}
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Owner/Occ / Refinances</div>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700 dark:text-slate-300">Applicant 1</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700 dark:text-slate-300">Applicant 2</span>
                    </label>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm font-semibold text-slate-700 md:min-w-max dark:text-slate-300">Contact Number</label>
                    <input className="rounded w-full border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>

                  {/* Row 2 */}
                  <div className="font-semibold text-slate-800 dark:text-slate-200">Purchases</div>

                  <div className="flex flex-wrap gap-4 items-center">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                      <span className="text-slate-700 dark:text-slate-300">Solicitor above</span>
                    </label>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                        <span className="text-slate-700 dark:text-slate-300">Other</span>
                      </label>
                      <input className="rounded border-slate-300 border-b-2 border-t-0 border-x-0 bg-transparent px-2 py-1 max-w-[150px] focus:ring-0 dark:border-slate-700 focus:border-primary" type="text" />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center gap-2">
                    <label className="text-sm font-semibold text-slate-700 md:min-w-max dark:text-slate-300">Contact Number</label>
                    <input className="rounded w-full border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>

                </div>
              </div>
            </div>

            {/* Funds to Complete */}
            <div className="mb-8">
              <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3 flex items-center justify-between">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Funds to Complete</h2>
                  <span className="text-white/80 text-xs italic hidden md:block">Where are you obtaining the funds that you are contributing to the transaction?</span>
                </div>

                <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">

                  <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">Proceeds of Property Sale</label>
                    <CurrencyInput />
                  </div>

                  <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">Savings</label>
                    <CurrencyInput />
                  </div>

                  <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">Government Grant</label>
                    <div className="flex gap-2">
                      <CurrencyInput className="flex-1 min-w-0" />
                      <input type="text" placeholder="Type" className="w-1/2 rounded border-slate-300 min-w-0 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" />
                    </div>
                  </div>

                  <div className="grid grid-cols-[1fr_1fr] items-center gap-4">
                    <label className="font-semibold text-slate-800 dark:text-slate-200">Other</label>
                    <div className="flex gap-2">
                      <CurrencyInput className="flex-1 min-w-0" />
                      <input type="text" placeholder="Detail" className="w-1/2 rounded border-slate-300 min-w-0 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" />
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Properties Section */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Properties</h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {properties.map((prop, index) => (
                    <div key={prop.id} className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5 ${index > 0 ? "mt-2" : ""}`}>
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-cyan-500 text-[22px]">home</span>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Property {index + 1}</h3>
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeProperty(prop.id)}
                            className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Address</label>
                          <input
                            type="text"
                            placeholder="Enter full address..."
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Property Type</label>
                          <select className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm">
                            <option value="">Select type...</option>
                            <option value="house">House</option>
                            <option value="unit">Unit</option>
                            <option value="townhouse">Townhouse</option>
                            <option value="duplex">Duplex</option>
                            <option value="land">Land</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                          <CurrencyInput placeholder="$0.00" className="text-sm" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Rental Income (p/m)</label>
                          <CurrencyInput placeholder="$0.00" className="text-sm" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                          <input
                            type="text"
                            placeholder="e.g. CommBank"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Applicable Mortgage #</label>
                          <input
                            type="text"
                            placeholder="e.g. 1"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                          <div className="flex gap-4 items-center h-[38px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Add Property Button */}
                  <button
                    type="button"
                    onClick={addProperty}
                    className="text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Another Property
                  </button>
                </div>
              </div>
            </div>

            {/* Bank Accounts Section */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Bank Accounts</h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {bankAccounts.map((acc, index) => (
                    <div key={acc.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-cyan-500 text-[22px]">account_balance</span>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Bank Account {index + 1}</h3>
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeBankAccount(acc.id)}
                            className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Financial Institution</label>
                          <input
                            type="text"
                            placeholder="e.g. CommBank"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Type</label>
                          <select className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm">
                            <option value="">Select type...</option>
                            <option value="transaction">Transaction</option>
                            <option value="saving">Saving</option>
                            <option value="pension">Pension</option>
                            <option value="term_deposit">Term Deposit</option>
                          </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                          <CurrencyInput placeholder="$0.00" className="text-sm" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">BSB</label>
                          <input
                            type="text"
                            placeholder="e.g. 062-000"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Account Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 12345678"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                          <div className="flex gap-4 items-center h-[38px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Add Bank Account Button */}
                  <button
                    type="button"
                    onClick={addBankAccount}
                    className="text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Another Bank Account
                  </button>
                </div>
              </div>
            </div>

            {/* Vehicles Section */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Vehicles</h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {vehicles.map((v, index) => (
                    <div key={v.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-cyan-500 text-[22px]">directions_car</span>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Vehicle {index + 1}</h3>
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeVehicle(v.id)}
                            className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Make &amp; Model</label>
                          <input
                            type="text"
                            placeholder="e.g. Toyota Camry"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Year</label>
                          <input
                            type="text"
                            placeholder="e.g. 2021"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                          <CurrencyInput placeholder="$0.00" className="text-sm" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Lender</label>
                          <input
                            type="text"
                            placeholder="e.g. CommBank"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                          <div className="flex gap-4 items-center h-[38px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Add Vehicle Button */}
                  <button
                    type="button"
                    onClick={addVehicle}
                    className="text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Another Vehicle
                  </button>
                </div>
              </div>
            </div>

            {/* Superannuation Section */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Superannuation</h2>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                  {superFunds.map((s, index) => (
                    <div key={s.id} className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                      {/* Card Header */}
                      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-cyan-500 text-[22px]">savings</span>
                          <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base">Superannuation Fund {index + 1}</h3>
                        </div>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeSuperFund(s.id)}
                            className="flex items-center gap-1 text-sm font-semibold text-red-500 hover:text-red-600 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            Remove
                          </button>
                        )}
                      </div>

                      {/* Fields Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        <div className="flex flex-col gap-1.5 md:col-span-2">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Fund Name / Institution</label>
                          <input
                            type="text"
                            placeholder="e.g. Australian Super"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Member Number</label>
                          <input
                            type="text"
                            placeholder="e.g. 123456789"
                            className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Balance</label>
                          <CurrencyInput placeholder="$0.00" className="text-sm" />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                          <div className="flex gap-4 items-center h-[38px]">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                            </label>
                          </div>
                        </div>

                      </div>
                    </div>
                  ))}

                  {/* Add Super Fund Button */}
                  <button
                    type="button"
                    onClick={addSuperFund}
                    className="text-primary font-semibold hover:bg-primary/10 bg-primary/5 px-4 py-3 rounded-xl transition-colors inline-flex items-center justify-center w-full gap-2 text-sm border-2 border-dashed border-primary/20 hover:border-primary/40"
                  >
                    <span className="material-symbols-outlined text-[20px]">add_circle</span>
                    Add Another Fund
                  </button>
                </div>
              </div>
            </div>

            {/* Shares / Investments Section */}
            <div className="mb-8">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Shares &amp; Investments</h2>
                </div>

                <div className="p-6 md:p-8">
                  {/* Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                    <div className="flex flex-col gap-1.5 md:col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Description</label>
                      <input
                        type="text"
                        placeholder="e.g. ASX shares, managed funds, ETFs"
                        className="rounded border-slate-300 dark:bg-slate-700 dark:border-slate-600 focus:ring-primary focus:border-primary text-sm"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Estimated Value</label>
                      <CurrencyInput placeholder="$0.00" className="text-sm" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ownership</label>
                      <div className="flex gap-4 items-center h-[38px]">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 1</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">Applicant 2</span>
                        </label>
                      </div>
                    </div>

                  </div>

                </div>
              </div>
            </div>

            {/* Current Assets */}
            <div className="mb-12">
              <div className="bg-white border text-sm border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="bg-cyan-500 px-6 py-3">
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Current Assets</h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[800px]">
                    <thead>
                      <tr className="border-b border-slate-200 bg-slate-50 dark:bg-slate-800/50 dark:border-slate-700 text-slate-600 dark:text-slate-300">
                        <th className="font-bold py-4 px-6 w-[20%]">Asset</th>
                        <th className="font-bold py-4 px-6 w-[35%] text-center">Address / Description</th>
                        <th className="font-bold py-4 px-6 w-[20%] text-center">Value</th>
                        <th className="font-bold py-4 px-6 w-[10%] text-center">Lender</th>
                        <th className="font-bold py-4 px-6 w-[15%] text-center">Ownership</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">

                      {/* Home Contents */}
                      <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                        <td className="py-4 px-6 align-top font-bold text-slate-800 dark:text-slate-200">
                          Home Contents
                        </td>
                        <td className="py-4 px-6 bg-slate-50/50 dark:bg-slate-800/10"></td>
                        <td className="py-4 px-6 align-top">
                          <CurrencyInput className="h-10 text-sm" />
                        </td>
                        <td className="py-4 px-6 align-top bg-slate-50/50 dark:bg-slate-800/10"></td>
                        <td className="py-4 px-6 align-top">
                          <div className="flex flex-col gap-2">
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm">App 1</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                              <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                              <span className="text-sm">App 2</span>
                            </label>
                          </div>
                        </td>
                      </tr>

                      {/* Other 1 - 2 */}
                      {[1, 2].map((num) => (
                        <tr key={`other-${num}`} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors">
                          <td className="py-4 px-6 align-top font-bold text-slate-800 dark:text-slate-200">
                            Other
                          </td>
                          <td className="py-4 px-6 bg-slate-50/50 dark:bg-slate-800/10"></td>
                          <td className="py-4 px-6 align-top">
                            <CurrencyInput className="h-10 text-sm" />
                          </td>
                          <td className="py-4 px-6 align-top bg-slate-50/50 dark:bg-slate-800/10"></td>
                          <td className="py-4 px-6 align-top">
                            <div className="flex flex-col gap-2">
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                                <span className="text-sm">App 1</span>
                              </label>
                              <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary border-slate-300" />
                                <span className="text-sm">App 2</span>
                              </label>
                            </div>
                          </td>
                        </tr>
                      ))}

                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
              <Link href="/employment-income" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <div className="flex items-center gap-6">
                <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">Save Draft</span>
                <Link href="#" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
                  Next Step
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </Link>
              </div>
            </div>

            {/* Need Help Box */}
            <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-primary mt-0.5">info</span>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">Need help?</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">If you&apos;re unsure about any details, you can save your progress and return later. Your mortgage broker will also review all information during your consultation.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Help Tooltip */}
      <button className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-white shadow-2xl transition-transform hover:scale-105">
        <span className="material-symbols-outlined text-3xl">chat_bubble</span>
      </button>
    </div>
  );
}

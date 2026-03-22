"use client";

import { PageShell } from "@/components/PageShell";
import { ApplicantTabs, CompletionStatus } from "@/components/ApplicantTabs";
import { useApplicants } from "@/context/applicants";
import Link from "next/link";
import { useState } from "react";

// ── Per-applicant form data ───────────────────────────────────────────────
interface PersonalData {
  // Applicant Details
  title: string;
  givenNames: string;
  surname: string;
  preferredName: string;
  dob: string;
  townOfBirth: string;
  maritalStatus: string;
  gender: string;
  permanentResident: string;
  visaType: string;
  licenceNumber: string;
  licenceState: string;
  licenceExpiry: string;
  dependentAges: string;
  mothersMaidenName: string;
  // Contact Details
  email: string;
  mobilePhone: string;
  homePhone: string;
  workPhone: string;
  // Nearest Relative
  relativeName: string;
  relativeRelationship: string;
  relativePhone: string;
  relativeAddress: string;
  // Address
  addressFinder: string;
  suburb: string;
  state: string;
  postcode: string;
  addressStartDate: string;
  addressStatus: string;
  prevAddress: string;
  prevAddressFrom: string;
  prevAddressTo: string;
}

const BLANK: PersonalData = {
  title: "", givenNames: "", surname: "", preferredName: "", dob: "",
  townOfBirth: "", maritalStatus: "", gender: "", permanentResident: "",
  visaType: "", licenceNumber: "", licenceState: "", licenceExpiry: "",
  dependentAges: "", mothersMaidenName: "",
  email: "", mobilePhone: "", homePhone: "", workPhone: "",
  relativeName: "", relativeRelationship: "", relativePhone: "", relativeAddress: "",
  addressFinder: "", suburb: "", state: "", postcode: "",
  addressStartDate: "", addressStatus: "",
  prevAddress: "", prevAddressFrom: "", prevAddressTo: "",
};

function completionStatus(d: PersonalData): CompletionStatus {
  const required = [d.givenNames, d.surname, d.dob, d.email, d.mobilePhone];
  const filled = required.filter(Boolean).length;
  if (filled === required.length) return "complete";
  if (filled > 0) return "partial";
  return "empty";
}

// ── Input class ───────────────────────────────────────────────────────────
const inputCls = "rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary";

// ── Page ─────────────────────────────────────────────────────────────────
export default function PersonalDetailsPage() {
  const { applicants } = useApplicants();
  const [activeId, setActiveId]   = useState(() => applicants[0]?.id ?? "");
  const [formData, setFormData]   = useState<Record<string, PersonalData>>({});

  const getData = (id: string): PersonalData => ({ ...BLANK, ...formData[id] });
  const setField = (id: string, field: keyof PersonalData, value: string) =>
    setFormData(prev => ({ ...prev, [id]: { ...BLANK, ...prev[id], [field]: value } }));

  const d  = getData(activeId);
  const up = (field: keyof PersonalData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setField(activeId, field, e.target.value);

  const completionMap = Object.fromEntries(
    applicants.map(a => [a.id, completionStatus(getData(a.id))])
  );

  return (
    <PageShell>
      <header className="mb-8">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 2 of 6
        </span>
        <h1 className="mb-4 text-3xl sm:text-4xl font-extrabold text-primary dark:text-slate-100">
          Personal Details
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please provide contact and identity information for each applicant.
        </p>
      </header>

      <ApplicantTabs
        applicants={applicants}
        activeId={activeId}
        onSelect={setActiveId}
        completionMap={completionMap}
      />


      <div className="mb-12 flex flex-col gap-8">

        {/* ── Applicant Details ─────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">badge</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Applicant Details</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-title-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                <select id={`pd-title-${activeId}`} value={d.title} onChange={up("title")} className={inputCls}>
                  <option value="">Select...</option>
                  <option>Mr</option><option>Mrs</option><option>Ms</option>
                  <option>Miss</option><option>Dr</option><option>Other</option>
                </select>
              </div>
              <div className="hidden md:block" />

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-given-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Given Name/s <span className="text-red-500">*</span>
                </label>
                <input id={`pd-given-${activeId}`} type="text" value={d.givenNames} onChange={up("givenNames")}
                  className={inputCls} placeholder="e.g. James" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-surname-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Surname <span className="text-red-500">*</span>
                </label>
                <input id={`pd-surname-${activeId}`} type="text" value={d.surname} onChange={up("surname")}
                  className={inputCls} placeholder="e.g. Smith" />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor={`pd-preferred-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Also Known As / Preferred Name</label>
                <input id={`pd-preferred-${activeId}`} type="text" value={d.preferredName} onChange={up("preferredName")} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-dob-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input id={`pd-dob-${activeId}`} type="date" value={d.dob} onChange={up("dob")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-town-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Town of Birth</label>
                <input id={`pd-town-${activeId}`} type="text" value={d.townOfBirth} onChange={up("townOfBirth")} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-marital-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marital Status</label>
                <select id={`pd-marital-${activeId}`} value={d.maritalStatus} onChange={up("maritalStatus")} className={inputCls}>
                  <option value="">Select...</option>
                  <option>Single</option><option>Married</option><option>De Facto</option><option>Divorced</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-gender-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <select id={`pd-gender-${activeId}`} value={d.gender} onChange={up("gender")} className={inputCls}>
                  <option value="">Select...</option>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-resident-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permanent in Australia?</label>
                <select id={`pd-resident-${activeId}`} value={d.permanentResident} onChange={up("permanentResident")} className={inputCls}>
                  <option value="">Select...</option><option>Yes</option><option>No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-visa-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Visa Type <span className="text-xs font-normal italic text-slate-500">(if applicable)</span>
                </label>
                <input id={`pd-visa-${activeId}`} type="text" value={d.visaType} onChange={up("visaType")} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor={`pd-licence-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Driver Licence Number</label>
                <input id={`pd-licence-${activeId}`} type="text" value={d.licenceNumber} onChange={up("licenceNumber")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-lic-state-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Licence State</label>
                <input id={`pd-lic-state-${activeId}`} type="text" value={d.licenceState} onChange={up("licenceState")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-lic-expiry-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Licence Expiry Date</label>
                <input id={`pd-lic-expiry-${activeId}`} type="date" value={d.licenceExpiry} onChange={up("licenceExpiry")} className={inputCls} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-dependents-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ages of Dependents</label>
                <input id={`pd-dependents-${activeId}`} type="text" value={d.dependentAges} onChange={up("dependentAges")} className={inputCls} placeholder="e.g. 5, 8" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-maiden-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mother&apos;s Maiden Name</label>
                <input id={`pd-maiden-${activeId}`} type="text" value={d.mothersMaidenName} onChange={up("mothersMaidenName")} className={inputCls} />
              </div>

            </div>
          </div>
        </div>

        {/* ── Contact Details ───────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">contact_phone</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Contact Details</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-email-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input id={`pd-email-${activeId}`} type="email" value={d.email} onChange={up("email")}
                  className={inputCls} placeholder="name@example.com" />
              </div>
              <div className="hidden md:block" />

              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-mobile-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Mobile Phone <span className="text-red-500">*</span>
                </label>
                <input id={`pd-mobile-${activeId}`} type="tel" value={d.mobilePhone} onChange={up("mobilePhone")}
                  className={inputCls} placeholder="0400 000 000" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-home-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Home Phone</label>
                <input id={`pd-home-${activeId}`} type="tel" value={d.homePhone} onChange={up("homePhone")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-work-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Phone</label>
                <input id={`pd-work-${activeId}`} type="tel" value={d.workPhone} onChange={up("workPhone")} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Nearest Relative ─────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">group</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">
              Nearest Relative{" "}
              <span className="text-white/70 text-xs font-normal normal-case tracking-normal italic">*Not living with you</span>
            </h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-rel-name-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <input id={`pd-rel-name-${activeId}`} type="text" value={d.relativeName} onChange={up("relativeName")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-rel-rel-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Relationship to You</label>
                <input id={`pd-rel-rel-${activeId}`} type="text" value={d.relativeRelationship} onChange={up("relativeRelationship")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-rel-phone-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Phone Number</label>
                <input id={`pd-rel-phone-${activeId}`} type="tel" value={d.relativePhone} onChange={up("relativePhone")} className={inputCls} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-rel-addr-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Details</label>
                <input id={`pd-rel-addr-${activeId}`} type="text" value={d.relativeAddress} onChange={up("relativeAddress")} className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Address Details ───────────────────────────────────────── */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">home_pin</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Address Details</h2>
          </div>
          <div className="p-4 sm:p-6 md:p-8">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">Current Residential Address</h3>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-addr-find-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Finder</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input id={`pd-addr-find-${activeId}`} type="text" value={d.addressFinder} onChange={up("addressFinder")}
                    className={`w-full pl-10 ${inputCls}`} placeholder="Start typing your address..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label htmlFor={`pd-suburb-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Suburb</label>
                  <input id={`pd-suburb-${activeId}`} type="text" value={d.suburb} onChange={up("suburb")} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-state-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
                  <select id={`pd-state-${activeId}`} value={d.state} onChange={up("state")} className={inputCls}>
                    {["NSW","VIC","QLD","WA","SA","TAS","ACT","NT"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-postcode-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Postcode</label>
                  <input id={`pd-postcode-${activeId}`} type="text" value={d.postcode} onChange={up("postcode")} className={inputCls} />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-addr-start-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start date at current address</label>
                  <input id={`pd-addr-start-${activeId}`} type="date" value={d.addressStartDate} onChange={up("addressStartDate")} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-addr-status-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Status</label>
                  <select id={`pd-addr-status-${activeId}`} value={d.addressStatus} onChange={up("addressStatus")} className={inputCls}>
                    <option value="">Select...</option>
                    <option>Mortgage</option><option>Own</option><option>Rent</option><option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-8" />
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">
              Previous Address{" "}
              <span className="text-sm font-normal italic text-slate-500">(if at current address &lt; 3 years)</span>
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor={`pd-prev-addr-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">Previous Address</label>
                <input id={`pd-prev-addr-${activeId}`} type="text" value={d.prevAddress} onChange={up("prevAddress")}
                  className={inputCls} placeholder="Enter previous address manually..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-prev-from-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">From Date</label>
                  <input id={`pd-prev-from-${activeId}`} type="date" value={d.prevAddressFrom} onChange={up("prevAddressFrom")} className={inputCls} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor={`pd-prev-to-${activeId}`} className="text-sm font-semibold text-slate-700 dark:text-slate-300">To Date</label>
                  <input id={`pd-prev-to-${activeId}`} type="date" value={d.prevAddressTo} onChange={up("prevAddressTo")} className={inputCls} />
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 z-10 mt-12 flex items-center justify-between border-t border-primary/10 bg-background-light py-4 dark:bg-background-dark md:static md:pt-8 md:pb-0 md:bg-transparent dark:md:bg-transparent">
        <Link href="/applicants" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
          <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          Back
        </Link>
        <div className="flex flex-col items-end gap-2 sm:flex-row sm:items-center sm:gap-6">
          <span className="hidden sm:block text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">Save Draft</span>
          <Link href="/employment-income" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
            Next Step
            <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
          </Link>
        </div>
      </div>

      <div className="mt-8 bg-slate-100 border border-slate-200 rounded-xl p-6 dark:bg-slate-800/50 dark:border-slate-700">
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

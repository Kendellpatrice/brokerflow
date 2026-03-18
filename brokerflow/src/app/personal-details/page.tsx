import { PageShell } from "@/components/PageShell";
import Link from "next/link";

export default function PersonalDetailsPage() {
  return (
    <PageShell>
      <header className="mb-10">
        <span className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
          Step 2 of 6
        </span>
        <h1 className="mb-4 text-4xl font-extrabold text-primary dark:text-slate-100">
          Personal Details
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Please provide the primary contact and identity information for all applicants
          associated with this mortgage application.
        </p>
      </header>

      {/* Applicant Details */}
      <div className="mb-12">
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">badge</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Applicant Details</h2>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-title" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                <select id="pd-title" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                  <option>Select...</option>
                  <option>Mr</option>
                  <option>Mrs</option>
                  <option>Ms</option>
                  <option>Miss</option>
                  <option>Dr</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="hidden md:block"></div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-given-names" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Given Name/s</label>
                <input id="pd-given-names" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. James" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-surname" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Surname</label>
                <input id="pd-surname" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. Smith" type="text" />
              </div>

              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label htmlFor="pd-preferred-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Also Known As / Preferred Name</label>
                <input id="pd-preferred-name" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-dob" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                <input id="pd-dob" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-town-of-birth" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Town of Birth</label>
                <input id="pd-town-of-birth" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-marital-status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marital Status</label>
                <select id="pd-marital-status" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                  <option>Select...</option>
                  <option>Single</option>
                  <option>Married</option>
                  <option>De Facto</option>
                  <option>Divorced</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-gender" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                <select id="pd-gender" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                  <option>Select...</option>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-permanent-resident" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permanent in Australia?</label>
                <select id="pd-permanent-resident" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                  <option>Select...</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-visa-type" className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Visa Type <span className="text-xs font-normal italic text-slate-500">(if applicable)</span>
                </label>
                <input id="pd-visa-type" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-licence-number" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Driver Licence Number</label>
                <input id="pd-licence-number" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-licence-state" className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
                  <input id="pd-licence-state" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-licence-expiry" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
                  <input id="pd-licence-expiry" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-dependent-ages" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ages of Dependents</label>
                <input id="pd-dependent-ages" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. 5, 8" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-mothers-maiden-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mother&apos;s Maiden Name</label>
                <input id="pd-mothers-maiden-name" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">contact_phone</span>
            <h3 className="font-bold text-white uppercase tracking-wider text-base">Contact Details</h3>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                <input id="pd-email" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="james.smith@example.com" type="email" />
              </div>
              <div className="hidden md:block"></div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-mobile-phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Phone</label>
                <input id="pd-mobile-phone" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="0400 000 000" type="tel" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-home-phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Home Phone</label>
                <input id="pd-home-phone" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-work-phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Phone</label>
                <input id="pd-work-phone" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
              </div>
            </div>
          </div>
        </div>

        {/* Nearest Relative */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">group</span>
            <h3 className="font-bold text-white uppercase tracking-wider text-base">
              Nearest Relative{" "}
              <span className="text-white/70 text-xs font-normal normal-case tracking-normal italic">
                *Not living with you
              </span>
            </h3>
          </div>
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-relative-name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                <input id="pd-relative-name" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-relative-relationship" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Relationship to You</label>
                <input id="pd-relative-relationship" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-relative-phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Phone Number</label>
                <input id="pd-relative-phone" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-relative-address" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Details</label>
                <input id="pd-relative-address" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
              </div>
            </div>
          </div>
        </div>

        {/* Address Details */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
          <div className="flex items-center gap-3 px-6 py-4 bg-primary">
            <span className="material-symbols-outlined text-white text-[20px]">home_pin</span>
            <h2 className="font-bold text-white uppercase tracking-wider text-base">Address Details</h2>
          </div>
          <div className="p-6 md:p-8">
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">Current Residential Address</h3>
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-address-finder" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Finder</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                  <input id="pd-address-finder" className="w-full pl-10 rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="Start typing your address..." type="text" />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1.5 col-span-2">
                  <label htmlFor="pd-suburb" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Suburb</label>
                  <input id="pd-suburb" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-address-state" className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
                  <select id="pd-address-state" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                    <option>NSW</option>
                    <option>VIC</option>
                    <option>QLD</option>
                    <option>WA</option>
                    <option>SA</option>
                    <option>TAS</option>
                    <option>ACT</option>
                    <option>NT</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-postcode" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Postcode</label>
                  <input id="pd-postcode" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-address-start-date" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start date at current address</label>
                  <input id="pd-address-start-date" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-address-status" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Status</label>
                  <select id="pd-address-status" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                    <option>Select...</option>
                    <option>Mortgage</option>
                    <option>Own</option>
                    <option>Rent</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-700 my-8"></div>
            <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">
              Previous Address{" "}
              <span className="text-sm font-normal italic text-slate-500">(if at current address &lt; 3 years)</span>
            </h3>
            <div className="grid grid-cols-1 gap-6">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="pd-prev-address" className="text-sm font-semibold text-slate-700 dark:text-slate-300">Previous Address</label>
                <input id="pd-prev-address" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="Enter previous address manually..." type="text" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-prev-address-from" className="text-sm font-semibold text-slate-700 dark:text-slate-300">From Date</label>
                  <input id="pd-prev-address-from" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="pd-prev-address-to" className="text-sm font-semibold text-slate-700 dark:text-slate-300">To Date</label>
                  <input id="pd-prev-address-to" className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
        <Link
          href="/applicants"
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
            href="/employment-income"
            className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90"
          >
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

/* eslint-disable @next/next/no-img-element */
import { SidebarNav } from "@/components/SidebarNav";
import Link from "next/link"; export default function PersonalDetailsPage() {
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

            {/* Applicant 1 Section */}
            <div className="mb-12">
              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-primary">
                  <span className="material-symbols-outlined text-white text-[20px]">badge</span>
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Applicant Details</h2>
                </div>
                <div className="p-6 md:p-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Title</label>
                    <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                      <option>Select...</option>
                      <option>Mr</option>
                      <option>Mrs</option>
                      <option>Ms</option>
                      <option>Miss</option>
                      <option>Dr</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="hidden md:block"></div> {/* Spacer */}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Given Name/s</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. James" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Surname</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. Smith" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Also Known As / Preferred Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Date of Birth</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Town of Birth</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Marital Status</label>
                    <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                      <option>Select...</option>
                      <option>Single</option>
                      <option>Married</option>
                      <option>De Facto</option>
                      <option>Divorced</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Gender</label>
                    <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                      <option>Select...</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Permanent in Australia?</label>
                    <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
                      <option>Select...</option>
                      <option>Yes</option>
                      <option>No</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Visa Type <span className="text-xs font-normal italic text-slate-500">(if applicable)</span></label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Driver Licence Number</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Expiry Date</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Ages of Dependents</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="e.g. 5, 8" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mother&apos;s Maiden Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>
                </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-primary">
                  <span className="material-symbols-outlined text-white text-[20px]">contact_phone</span>
                  <h3 className="font-bold text-white uppercase tracking-wider text-base">Contact Details</h3>
                </div>
                <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Email Address</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="james.smith@example.com" type="email" />
                  </div>
                  <div className="hidden md:block"></div> {/* Spacer */}

                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Mobile Phone</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="0400 000 000" type="tel" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Home Phone</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Work Phone</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>
                </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 mb-8 shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-primary">
                  <span className="material-symbols-outlined text-white text-[20px]">group</span>
                  <h3 className="font-bold text-white uppercase tracking-wider text-base">Nearest Relative <span className="text-white/70 text-xs font-normal normal-case tracking-normal italic">*Not living with you</span></h3>
                </div>
                <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Name</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Relationship to You</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Contact Phone Number</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="tel" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Details</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                  </div>
                </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl overflow-hidden dark:bg-slate-800 dark:border-slate-700 shadow-sm">
                <div className="flex items-center gap-3 px-6 py-4 bg-primary">
                  <span className="material-symbols-outlined text-white text-[20px]">home_pin</span>
                  <h2 className="font-bold text-white uppercase tracking-wider text-base">Address Details</h2>
                </div>
                <div className="p-6 md:p-8">

                <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">Current Residential Address</h3>
                <div className="grid grid-cols-1 gap-6 mb-8">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Finder</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                      <input className="w-full pl-10 rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="Start typing your address..." type="text" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1.5 col-span-2">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Suburb</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">State</label>
                      <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
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
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Postcode</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="text" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Start date at current address</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Address Status</label>
                      <select className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary">
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
                <h3 className="mb-4 font-bold text-slate-800 dark:text-slate-200">Previous Address <span className="text-sm font-normal italic text-slate-500">(if at current address &lt; 3 years)</span></h3>
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Previous Address</label>
                    <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" placeholder="Enter previous address manually..." type="text" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">From Date</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">To Date</label>
                      <input className="rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary" type="date" />
                    </div>
                  </div>
                </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-12 flex items-center justify-between border-t border-primary/10 pt-8">
              <Link href="/applicants" className="flex items-center gap-2 rounded-lg border border-primary px-6 py-3 font-bold text-primary transition-colors hover:bg-primary/5">
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                Back
              </Link>
              <div className="flex items-center gap-6">
                <span className="text-slate-500 font-semibold cursor-pointer hover:text-primary transition-colors dark:text-slate-400">Save Draft</span>
                <Link href="/employment-income" className="flex items-center gap-2 rounded-lg bg-primary px-10 py-3 font-bold text-white shadow-lg transition-shadow hover:bg-primary/90">
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

      {/* Footer Info */}
      <footer className="border-t border-primary/10 bg-white px-6 py-4 text-center dark:bg-background-dark/80">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">
          © 2024 uBroker Mortgage Solutions. All sensitive data is encrypted with bank-grade security.
        </p>
      </footer>
    </div>
  );
}

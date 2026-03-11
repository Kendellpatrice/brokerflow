import React from 'react';

type ApplicantColumnProps = {
  title: string;
  primaryLabel: string;
  secondaryLabel: string;
  isPrimary?: boolean;
};

type FormFieldProps = {
  label: string;
  type?: string;
  placeholder?: string;
  options?: string[];
  subLabel?: string;
};

const FormField = ({ label, type = "text", placeholder = "", options = [], subLabel = "" }: FormFieldProps) => {
  return (
    <div className="flex flex-col gap-1.5 pb-2">
      <label className="text-sm font-bold text-slate-800 dark:text-slate-200">
        {label}
        {subLabel && <span className="ml-1 text-xs font-normal text-slate-500 italic">{subLabel}</span>}
      </label>
      {options.length > 0 ? (
        <select className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white">
          <option>Select...</option>
          {options.map((opt: string) => <option key={opt}>{opt}</option>)}
        </select>
      ) : (
        <input
          type={type}
          placeholder={placeholder}
          className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white"
        />
      )}
    </div>
  );
};

type FormRadioGroupProps = {
  label: string;
  name: string;
  options: string[];
  inlineInput?: string;
};

const FormRadioGroup = ({ label, name, options, inlineInput = "" }: FormRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <label className="text-sm font-bold text-slate-800 dark:text-slate-200">{label}</label>
      <div className="flex flex-wrap gap-4 items-center">
        {options.map((opt: string) => (
          <label key={opt} className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
            <input type="radio" name={name} className="text-primary focus:ring-primary border-slate-300 dark:border-slate-600 dark:bg-slate-800 size-4" value={opt} />
            {opt}
          </label>
        ))}
        {inlineInput && (
          <div className="flex items-center gap-2 mt-2 sm:mt-0 xl:ml-4">
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 truncate">{inlineInput}</span>
            <input type="text" className="w-full sm:w-32 rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-9 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
          </div>
        )}
      </div>
    </div>
  );
};

export const ApplicantColumn: React.FC<ApplicantColumnProps> = ({ title, primaryLabel, secondaryLabel, isPrimary }) => {
  return (
    <div className="flex flex-col border border-primary/20 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm transition-shadow hover:shadow-md h-full">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between bg-primary px-4 py-3 text-white">
        <span className="font-extrabold tracking-widest text-lg">{title}</span>
        <div className="flex gap-4 text-sm font-medium">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded size-4 focus:ring-white border-white bg-transparent outline-none focus:outline-none" 
              defaultChecked={isPrimary} 
            /> 
            {primaryLabel}
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              className="rounded size-4 focus:ring-white border-white bg-transparent outline-none focus:outline-none" 
            /> 
            {secondaryLabel}
          </label>
        </div>
      </div>
      
      {/* Form Fields */}
      <div className="p-5 flex flex-col gap-4 divide-y divide-primary/5">
        <div className="pt-2">
          <FormField label="Title" options={["Mr", "Mrs", "Ms", "Miss", "Dr", "Other"]} />
        </div>
        <div className="pt-4">
          <FormField label="Given Name/s" />
        </div>
        <div className="pt-4">
          <FormField label="Also Known As/Preferred Name" />
        </div>
        <div className="pt-4">
          <FormField label="Surname" />
        </div>
        
        <div className="pt-4">
          <FormRadioGroup label="Marital Status" name={`maritalStatus-${title}`} options={["Single", "Married", "De facto", "Divorced"]} />
        </div>
        
        <div className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Date of Birth" type="date" />
          <FormField label="Town of Birth" />
        </div>
        
        <div className="pt-4">
          <FormRadioGroup label="Gender" name={`gender-${title}`} options={["Male", "Female", "Other"]} />
        </div>
        
        <div className="pt-4 flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Residency - Permanent in Australia?</label>
          <div className="flex flex-wrap gap-4 items-center">
             <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name={`residency-${title}`} value="Yes" className="text-primary focus:ring-primary border-slate-300 dark:border-slate-600 dark:bg-slate-800 size-4" />
                Yes
             </label>
             <label className="flex items-center gap-1.5 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                <input type="radio" name={`residency-${title}`} value="No" className="text-primary focus:ring-primary border-slate-300 dark:border-slate-600 dark:bg-slate-800 size-4" />
                No
             </label>
             <div className="flex items-center gap-2 mt-2 sm:mt-0 lg:ml-4 w-full sm:w-auto">
               <span className="text-sm font-medium text-slate-700 dark:text-slate-300 shrink-0">If no, Country:</span>
               <input type="text" className="w-full sm:w-40 rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-9 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
             </div>
          </div>
        </div>
        
        <div className="pt-4">
          <FormField label="Visa Type" subLabel="(if applicable)" />
        </div>
        
        <div className="pt-4">
          <FormField label="Current Address" />
        </div>
        
        <div className="pt-4">
          <FormField label="Start date at current address" type="date" />
        </div>
        
        <div className="pt-4">
          <FormRadioGroup label="Address Status" name={`addressStatus-${title}`} options={["Mortgage", "Own", "Rent", "Other"]} inlineInput="Details:" />
        </div>
        
        <div className="pt-4">
          <FormField label="Previous Addresses" />
        </div>
        
        <div className="pt-4 grid grid-cols-2 gap-4">
          <FormField label="Dates at Address (From)" type="date" />
          <FormField label="Dates at Address (To)" type="date" />
        </div>
        
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-6 gap-4 items-end">
          <div className="sm:col-span-3"><FormField label="Driver Licence Number" /></div>
          <div className="sm:col-span-1"><FormField label="State" /></div>
          <div className="sm:col-span-2"><FormField label="Expiry Date" type="date" /></div>
        </div>
        
        <div className="pt-4 flex flex-col gap-3">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Phone Numbers</label>
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
            <div className="flex items-center gap-2"><span className="text-sm font-semibold w-5 shrink-0 text-slate-500">M:</span><input type="tel" className="w-full rounded border-slate-300 sm:text-sm h-9 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
            <div className="flex items-center gap-2"><span className="text-sm font-semibold w-5 shrink-0 text-slate-500">H:</span><input type="tel" className="w-full rounded border-slate-300 sm:text-sm h-9 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
            <div className="flex items-center gap-2"><span className="text-sm font-semibold w-5 shrink-0 text-slate-500">W:</span><input type="tel" className="w-full rounded border-slate-300 sm:text-sm h-9 shadow-sm focus:border-primary focus:ring-primary dark:border-slate-700 dark:bg-slate-800 dark:text-white" /></div>
          </div>
        </div>
        
        <div className="pt-4">
          <FormField label="Email Address" type="email" />
        </div>
        
        <div className="pt-4 flex flex-col gap-2">
          <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Ages of All Dependents</label>
          <input type="text" placeholder="e.g. 5, 8 (leave blank if none)" className="w-full rounded-md border-slate-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
        </div>
        
        <div className="pt-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700 p-4">
            <h4 className="flex flex-wrap items-center gap-2 text-sm font-bold text-primary dark:text-primary-light mb-4">
              Nearest Relative 
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold italic text-primary">Not living with you</span>
            </h4>
            <div className="flex flex-col gap-3">
               <div><FormField label="Name" /></div>
               <div><FormField label="Relationship to You" /></div>
               <div><FormField label="Contact Phone Number" type="tel" /></div>
               <div><FormField label="Address Details" /></div>
            </div>
          </div>
        </div>
        
        <div className="pt-4">
          <FormField label="Mother's Maiden Name" />
        </div>
      </div>
    </div>
  );
};

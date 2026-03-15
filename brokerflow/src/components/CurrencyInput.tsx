"use client";

import { InputHTMLAttributes, useState, ChangeEvent } from "react";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string | number;
  onChange?: (value: string) => void;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const [localValue, setLocalValue] = useState<string>(
    value ? formatCurrency(String(value)) : ""
  );

  function formatCurrency(val: string) {
    if (!val) return "";
    
    // Remove all non-digits and non-decimal points
    let cleanValue = String(val).replace(/[^\d.]/g, "");
    
    // Ensure only one decimal point
    const parts = cleanValue.split(".");
    if (parts.length > 2) {
      cleanValue = parts[0] + "." + parts.slice(1).join("");
    }
    
    if (!cleanValue) return "";

    const splitValue = cleanValue.split(".");
    const wholePart = splitValue[0] || "0";
    // Limit decimal to 2 places
    const decimalPart = splitValue.length > 1 ? "." + splitValue[1].slice(0, 2) : "";

    // Format the whole number part with commas
    const formattedWhole = Number(wholePart).toLocaleString("en-US");
    
    // Preserve the decimal point if user is currently typing it
    return cleanValue.includes(".") ? formattedWhole + decimalPart : formattedWhole;
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    
    if (rawVal === "") {
        setLocalValue("");
        if (onChange) onChange("");
        return;
    }

    let cleanVal = rawVal.replace(/[^\d.]/g, "");
    const parts = cleanVal.split(".");
    if (parts.length > 2) {
      cleanVal = parts[0] + "." + parts.slice(1).join("");
    }
    if (parts.length > 1) {
      cleanVal = parts[0] + "." + parts[1].slice(0, 2);
    }

    const formatted = formatCurrency(cleanVal);
    setLocalValue(formatted);

    if (onChange) {
      onChange(cleanVal);
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        className={`w-full pl-8 rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary ${className || ""}`}
        {...props}
      />
    </div>
  );
}

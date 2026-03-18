"use client";

import { InputHTMLAttributes, useState, ChangeEvent } from "react";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value?: string | number;
  onChange?: (value: string) => void;
}

function formatCurrency(val: string): string {
  if (!val) return "";

  let clean = String(val).replace(/[^\d.]/g, "");

  // Keep only the first decimal point
  const parts = clean.split(".");
  if (parts.length > 2) {
    clean = parts[0] + "." + parts.slice(1).join("");
  }

  if (!clean) return "";

  const [whole, decimal] = clean.split(".");
  const formattedWhole = Number(whole || "0").toLocaleString("en-US");
  const decimalPart = decimal !== undefined ? "." + decimal.slice(0, 2) : "";

  // Preserve the trailing decimal point while the user is still typing
  return clean.includes(".") ? formattedWhole + decimalPart : formattedWhole;
}

export function CurrencyInput({ value, onChange, className, ...props }: CurrencyInputProps) {
  const externalStr = value !== undefined ? String(value) : undefined;

  // Track the last external value we received so we can detect prop changes during render
  const [prevExternal, setPrevExternal] = useState(externalStr);
  const [localValue, setLocalValue]     = useState(externalStr ? formatCurrency(externalStr) : "");

  // Sync prop → local display state during render (no effect needed)
  if (externalStr !== prevExternal) {
    setPrevExternal(externalStr);
    setLocalValue(externalStr !== undefined ? formatCurrency(externalStr) : "");
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;

    if (raw === "") {
      setLocalValue("");
      onChange?.("");
      return;
    }

    let clean = raw.replace(/[^\d.]/g, "");
    const parts = clean.split(".");
    if (parts.length > 2) {
      clean = parts[0] + "." + parts.slice(1).join("");
    }
    if (parts.length > 1) {
      clean = parts[0] + "." + parts[1].slice(0, 2);
    }

    setLocalValue(formatCurrency(clean));
    onChange?.(clean);
  };

  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
      <input
        type="text"
        inputMode="decimal"
        value={localValue}
        onChange={handleChange}
        className={`w-full pl-8 rounded border-slate-300 dark:bg-slate-800 dark:border-slate-700 focus:ring-primary focus:border-primary ${className ?? ""}`}
        {...props}
      />
    </div>
  );
}

interface PhaseDividerProps {
  phase: string;
  title: string;
  description: string;
}

export function PhaseDivider({ title, description }: PhaseDividerProps) {
  return (
    <div className="flex items-start gap-4 mb-4 mt-2">
      <div className="pt-1">
        <h3 className="font-bold text-primary text-base uppercase tracking-wider">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">{description}</p>
      </div>
    </div>
  );
}

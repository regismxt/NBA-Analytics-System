import type { LucideIcon } from "lucide-react";
import { formatNumber } from "../utils/format";

type StatCardProps = {
  title: string;
  value: number | string;
  detail?: string;
  icon: LucideIcon;
  tone?: "rim" | "court" | "mint";
};

const toneMap = {
  rim: "bg-rim/12 text-rim border-rim/25",
  court: "bg-court/12 text-orange-200 border-court/25",
  mint: "bg-mint/12 text-mint border-mint/25"
};

export function StatCard({ title, value, detail, icon: Icon, tone = "rim" }: StatCardProps) {
  const displayValue = typeof value === "number" ? formatNumber(value, 1) : value;

  return (
    <section className="rounded-lg border border-white/10 bg-panel/88 p-4 shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-slate-400">{title}</p>
          <p className="mt-2 truncate text-3xl font-bold text-white">{displayValue}</p>
          {detail ? <p className="mt-2 truncate text-sm text-slate-400">{detail}</p> : null}
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg border ${toneMap[tone]}`}>
          <Icon size={20} />
        </div>
      </div>
    </section>
  );
}

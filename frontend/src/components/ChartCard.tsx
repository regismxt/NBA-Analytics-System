import type { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  children: ReactNode;
};

export function ChartCard({ title, children }: ChartCardProps) {
  return (
    <section className="rounded-lg border border-white/10 bg-panel/88 p-4 shadow-glow">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      <div className="h-80 min-w-0">{children}</div>
    </section>
  );
}

import { useMemo, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { RankingTable } from "../components/RankingTable";
import { useTopPerformers } from "../hooks/useApi";
import type { TopPerformers } from "../types/models";

type MetricKey = keyof TopPerformers;

const metrics: Array<{ key: MetricKey; label: string; color: string }> = [
  { key: "points", label: "Pontos", color: "#38bdf8" },
  { key: "assists", label: "Assistencias", color: "#2dd4bf" },
  { key: "rebounds", label: "Rebotes", color: "#f97316" },
  { key: "efficiency", label: "Eficiencia", color: "#a78bfa" },
  { key: "impact", label: "Impacto", color: "#facc15" }
];

export function AnalyticsPage() {
  const [metric, setMetric] = useState<MetricKey>("points");
  const { data, isLoading, error } = useTopPerformers();

  const selected = metrics.find((item) => item.key === metric)!;
  const chartData = useMemo(
    () =>
      (data?.[metric] ?? []).slice(0, 8).map((row) => ({
        name: row.fullName.split(" ").slice(-1)[0],
        value: row.total
      })),
    [data, metric]
  );

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : undefined} />;

  return (
    <>
      <PageHeader
        title="Analytics"
        description="Rankings, impacto e eficiencia por jogador."
        actions={
          <div className="flex flex-wrap gap-2">
            {metrics.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setMetric(item.key)}
                className={[
                  "h-10 rounded-lg border px-3 text-sm transition",
                  metric === item.key ? "border-rim bg-rim text-ink" : "border-white/10 bg-panel text-slate-300 hover:bg-white/10"
                ].join(" ")}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <ChartCard title={`Top jogadores por ${selected.label.toLowerCase()}`}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#243244" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ background: "#101a24", border: "1px solid #233242", borderRadius: 8 }} />
              <Bar dataKey="value" name={selected.label} fill={selected.color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section className="grid gap-4">
          <RankingTable rows={data.points.slice(0, 5)} label="PTS" />
          <RankingTable rows={data.efficiency.slice(0, 5)} label="EFF" />
        </section>
      </div>

      <section className="mt-6">
        <h3 className="mb-4 text-base font-semibold text-white">Tabela analitica</h3>
        <RankingTable rows={data[metric]} label={selected.label} />
      </section>
    </>
  );
}

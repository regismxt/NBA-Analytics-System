import { GitCompare } from "lucide-react";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { api } from "../services/api";
import { usePlayers } from "../hooks/useApi";
import { formatNumber } from "../utils/format";

export function ComparePage() {
  const playersQuery = usePlayers();
  const playerOptions = playersQuery.data ?? [];
  const [playerAId, setPlayerAId] = useState<number | "">("");
  const [playerBId, setPlayerBId] = useState<number | "">("");

  const comparisonQuery = useQuery({
    queryKey: ["compare", playerAId, playerBId],
    queryFn: () => api.comparePlayers(Number(playerAId), Number(playerBId)),
    enabled: Boolean(playerAId && playerBId && playerAId !== playerBId)
  });

  const chartData = useMemo(() => {
    const data = comparisonQuery.data;
    if (!data) return [];
    return [
      {
        metric: "PTS",
        A: data.playerA.averages.points,
        B: data.playerB.averages.points
      },
      {
        metric: "REB",
        A: data.playerA.averages.rebounds,
        B: data.playerB.averages.rebounds
      },
      {
        metric: "AST",
        A: data.playerA.averages.assists,
        B: data.playerB.averages.assists
      },
      {
        metric: "EFF",
        A: data.playerA.averages.efficiency,
        B: data.playerB.averages.efficiency
      },
      {
        metric: "IMP",
        A: data.playerA.averages.impactScore,
        B: data.playerB.averages.impactScore
      }
    ];
  }, [comparisonQuery.data]);

  if (playersQuery.isLoading) return <LoadingState />;
  if (playersQuery.error) return <ErrorState message={playersQuery.error instanceof Error ? playersQuery.error.message : undefined} />;

  const playerAName = comparisonQuery.data?.playerA.player?.fullName ?? "Jogador A";
  const playerBName = comparisonQuery.data?.playerB.player?.fullName ?? "Jogador B";

  return (
    <>
      <PageHeader
        title="Comparar jogadores"
        description="Medias, eficiencia e impacto lado a lado."
        actions={<GitCompare className="text-rim" size={28} />}
      />

      <section className="rounded-lg border border-white/10 bg-panel/88 p-4 shadow-glow">
        <div className="grid gap-3 md:grid-cols-2">
          <select
            value={playerAId}
            onChange={(event) => setPlayerAId(event.target.value ? Number(event.target.value) : "")}
            className="h-11 rounded-lg border border-white/10 bg-ink px-3 text-sm text-white outline-none focus:border-rim"
          >
            <option value="">Jogador A</option>
            {playerOptions.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName} - {player.team.abbreviation}
              </option>
            ))}
          </select>
          <select
            value={playerBId}
            onChange={(event) => setPlayerBId(event.target.value ? Number(event.target.value) : "")}
            className="h-11 rounded-lg border border-white/10 bg-ink px-3 text-sm text-white outline-none focus:border-rim"
          >
            <option value="">Jogador B</option>
            {playerOptions.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName} - {player.team.abbreviation}
              </option>
            ))}
          </select>
        </div>
      </section>

      {comparisonQuery.isLoading ? <div className="mt-6"><LoadingState /></div> : null}
      {comparisonQuery.error ? (
        <div className="mt-6">
          <ErrorState message={comparisonQuery.error instanceof Error ? comparisonQuery.error.message : undefined} />
        </div>
      ) : null}

      {comparisonQuery.data ? (
        <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.8fr]">
          <ChartCard title={`${playerAName} vs ${playerBName}`}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="#243244" strokeDasharray="3 3" />
                <XAxis dataKey="metric" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#101a24", border: "1px solid #233242", borderRadius: 8 }} />
                <Legend />
                <Bar dataKey="A" name={playerAName} fill="#38bdf8" radius={[5, 5, 0, 0]} />
                <Bar dataKey="B" name={playerBName} fill="#f97316" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <section className="rounded-lg border border-white/10 bg-panel/88 p-4 shadow-glow">
            <h3 className="mb-4 text-base font-semibold text-white">Resumo</h3>
            <div className="grid gap-3">
              {[
                ["Pontos", comparisonQuery.data.playerA.averages.points, comparisonQuery.data.playerB.averages.points],
                ["Rebotes", comparisonQuery.data.playerA.averages.rebounds, comparisonQuery.data.playerB.averages.rebounds],
                ["Assistencias", comparisonQuery.data.playerA.averages.assists, comparisonQuery.data.playerB.averages.assists],
                ["FG%", comparisonQuery.data.playerA.averages.fgPercentage, comparisonQuery.data.playerB.averages.fgPercentage],
                ["Impacto", comparisonQuery.data.playerA.averages.impactScore, comparisonQuery.data.playerB.averages.impactScore]
              ].map(([label, a, b]) => (
                <div key={label} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg bg-white/5 px-3 py-2 text-sm">
                  <span className="text-slate-400">{label}</span>
                  <span className="w-16 text-right font-semibold text-rim">{formatNumber(Number(a), 1)}</span>
                  <span className="w-16 text-right font-semibold text-court">{formatNumber(Number(b), 1)}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

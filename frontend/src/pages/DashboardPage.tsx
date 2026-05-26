import { Activity, Flame, Trophy, Users } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { ErrorState } from "../components/ErrorState";
import { GameCard } from "../components/GameCard";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { RankingTable } from "../components/RankingTable";
import { StatCard } from "../components/StatCard";
import { useDashboard } from "../hooks/useApi";

export function DashboardPage() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : undefined} />;

  const chartData = data.topScorers.map((row) => ({
    name: row.fullName.split(" ").slice(-1)[0],
    points: row.total
  }));

  return (
    <>
      <PageHeader
        eyebrow="Temporada 2025-26"
        title="NBA Live Analytics Dashboard"
        description="Visao geral de jogos, rankings e eficiencia dos jogadores."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Jogos cadastrados" value={data.totals.games} detail="Calendario local" icon={Activity} tone="rim" />
        <StatCard title="Jogadores" value={data.totals.players} detail="Elenco mockado" icon={Users} tone="mint" />
        <StatCard
          title="Maior pontuador"
          value={data.totals.topScorer?.total ?? 0}
          detail={data.totals.topScorer?.fullName ?? "Sem dados"}
          icon={Flame}
          tone="court"
        />
        <StatCard
          title="Maior eficiencia"
          value={data.totals.mostEfficient?.total ?? 0}
          detail={data.totals.mostEfficient?.fullName ?? "Sem dados"}
          icon={Trophy}
          tone="mint"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <ChartCard title="Top jogadores por pontos">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: -12 }}>
              <CartesianGrid stroke="#243244" strokeDasharray="3 3" />
              <XAxis dataKey="name" stroke="#94a3b8" tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "rgba(56, 189, 248, 0.08)" }}
                contentStyle={{ background: "#101a24", border: "1px solid #233242", borderRadius: 8 }}
              />
              <Bar dataKey="points" name="Pontos" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <section>
          <h3 className="mb-4 text-base font-semibold text-white">Jogos recentes</h3>
          <div className="grid gap-3">
            {data.recentGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6">
        <h3 className="mb-4 text-base font-semibold text-white">Ranking top 10 por pontos</h3>
        <RankingTable rows={data.topScorers} label="Pontos" />
      </section>
    </>
  );
}

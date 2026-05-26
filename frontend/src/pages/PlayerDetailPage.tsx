import { ArrowLeft, BadgePercent, Gauge, Medal, Target } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartCard } from "../components/ChartCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { StatCard } from "../components/StatCard";
import { usePlayer } from "../hooks/useApi";
import { formatDate, formatNumber } from "../utils/format";

export function PlayerDetailPage() {
  const { id } = useParams();
  const { data: player, isLoading, error } = usePlayer(id);

  if (isLoading) return <LoadingState />;
  if (error || !player) return <ErrorState message={error instanceof Error ? error.message : undefined} />;

  const stats = [...(player.stats ?? [])].reverse();
  const chartData = stats.map((stat) => ({
    game: stat.game ? `${stat.game.awayTeam.abbreviation}@${stat.game.homeTeam.abbreviation}` : `J${stat.gameId}`,
    points: stat.points,
    assists: stat.assists,
    rebounds: stat.rebounds
  }));

  return (
    <>
      <PageHeader
        eyebrow={`${player.team.abbreviation} | ${player.position}`}
        title={player.fullName}
        description={`${player.height ?? "--"} | ${player.weight ?? "--"} lb | ${player.active ? "Ativo" : "Inativo"}`}
        actions={
          <Link to="/players" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-200 hover:bg-white/10">
            <ArrowLeft size={16} />
            Voltar
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Media de pontos" value={player.averages?.points ?? 0} detail={`${player.averages?.gamesPlayed ?? 0} jogos`} icon={Target} />
        <StatCard title="Media de rebotes" value={player.averages?.rebounds ?? 0} detail="REB" icon={Medal} tone="court" />
        <StatCard title="Media de assistencias" value={player.averages?.assists ?? 0} detail="AST" icon={Gauge} tone="mint" />
        <StatCard title="Eficiencia" value={player.averages?.efficiency ?? 0} detail="EFF medio" icon={BadgePercent} tone="mint" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_0.85fr]">
        <ChartCard title="Evolucao de pontos">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: -12 }}>
                <CartesianGrid stroke="#243244" strokeDasharray="3 3" />
                <XAxis dataKey="game" stroke="#94a3b8" tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#101a24", border: "1px solid #233242", borderRadius: 8 }} />
                <Line type="monotone" dataKey="points" name="Pontos" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="rebounds" name="Rebotes" stroke="#f97316" strokeWidth={2} />
                <Line type="monotone" dataKey="assists" name="Assistencias" stroke="#2dd4bf" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="Sem jogos para graficar." />
          )}
        </ChartCard>

        <section>
          <h3 className="mb-4 text-base font-semibold text-white">Historico de jogos</h3>
          <div className="overflow-hidden rounded-lg border border-white/10 bg-panel/88">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Jogo</th>
                    <th className="px-4 py-3">Data</th>
                    <th className="px-4 py-3 text-right">PTS</th>
                    <th className="px-4 py-3 text-right">REB</th>
                    <th className="px-4 py-3 text-right">AST</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {player.stats?.map((stat) => (
                    <tr key={stat.id} className="hover:bg-white/5">
                      <td className="px-4 py-3 text-white">
                        {stat.game ? `${stat.game.awayTeam.abbreviation} @ ${stat.game.homeTeam.abbreviation}` : `Jogo ${stat.gameId}`}
                      </td>
                      <td className="px-4 py-3 text-slate-300">{stat.game ? formatDate(stat.game.gameDate) : "--"}</td>
                      <td className="px-4 py-3 text-right font-semibold">{formatNumber(stat.points, 0)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(stat.rebounds, 0)}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(stat.assists, 0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

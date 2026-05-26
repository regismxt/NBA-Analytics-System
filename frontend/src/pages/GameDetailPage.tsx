import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { useGame, useGameStats } from "../hooks/useApi";
import { formatDate, formatNumber, statusTone } from "../utils/format";

export function GameDetailPage() {
  const { id } = useParams();
  const gameQuery = useGame(id);
  const statsQuery = useGameStats(id);

  if (gameQuery.isLoading || statsQuery.isLoading) return <LoadingState />;
  if (gameQuery.error || statsQuery.error || !gameQuery.data) {
    const error = gameQuery.error ?? statsQuery.error;
    return <ErrorState message={error instanceof Error ? error.message : undefined} />;
  }

  const game = gameQuery.data;
  const stats = statsQuery.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow={formatDate(game.gameDate)}
        title={`${game.awayTeam.abbreviation} @ ${game.homeTeam.abbreviation}`}
        actions={
          <Link to="/games" className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 px-3 text-sm text-slate-200 hover:bg-white/10">
            <ArrowLeft size={16} />
            Voltar
          </Link>
        }
      />

      <section className="rounded-lg border border-white/10 bg-panel/88 p-5 shadow-glow">
        <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <div>
            <p className="text-sm text-slate-400">Visitante</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{game.awayTeam.city} {game.awayTeam.name}</h3>
          </div>
          <div className="rounded-lg border border-white/10 bg-ink px-6 py-4 text-center">
            <p className="text-4xl font-black text-white">{game.awayScore} - {game.homeScore}</p>
            <span className={`mt-3 inline-block rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(game.status)}`}>
              {game.status}
            </span>
            <p className="mt-2 text-sm text-slate-400">Periodo {game.period} | {game.clock ?? "--"}</p>
          </div>
          <div className="text-left md:text-right">
            <p className="text-sm text-slate-400">Casa</p>
            <h3 className="mt-1 text-2xl font-bold text-white">{game.homeTeam.city} {game.homeTeam.name}</h3>
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="mb-4 text-base font-semibold text-white">Estatisticas dos jogadores</h3>
        {stats.length ? (
          <div className="overflow-hidden rounded-lg border border-white/10 bg-panel/88">
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead className="bg-white/5 text-left text-xs uppercase text-slate-400">
                  <tr>
                    <th className="px-4 py-3">Jogador</th>
                    <th className="px-4 py-3">Time</th>
                    <th className="px-4 py-3 text-right">MIN</th>
                    <th className="px-4 py-3 text-right">PTS</th>
                    <th className="px-4 py-3 text-right">REB</th>
                    <th className="px-4 py-3 text-right">AST</th>
                    <th className="px-4 py-3 text-right">EFF</th>
                    <th className="px-4 py-3 text-right">FG%</th>
                    <th className="px-4 py-3 text-right">+/-</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {stats.map((stat) => (
                    <tr key={stat.id} className="hover:bg-white/5">
                      <td className="px-4 py-3">
                        <Link to={`/players/${stat.playerId}`} className="font-semibold text-white hover:text-rim">
                          {stat.player.fullName}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-slate-300">{stat.team.abbreviation}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(stat.minutesPlayed, 0)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-white">{stat.points}</td>
                      <td className="px-4 py-3 text-right">{stat.rebounds}</td>
                      <td className="px-4 py-3 text-right">{stat.assists}</td>
                      <td className="px-4 py-3 text-right text-mint">{stat.efficiency}</td>
                      <td className="px-4 py-3 text-right">{formatNumber(stat.fgPercentage, 1)}%</td>
                      <td className="px-4 py-3 text-right">{stat.plusMinus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <EmptyState title="Jogo ainda sem estatisticas registradas." />
        )}
      </section>
    </>
  );
}

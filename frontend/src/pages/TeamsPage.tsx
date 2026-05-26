import { Link } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { useTeams } from "../hooks/useApi";

export function TeamsPage() {
  const { data, isLoading, error } = useTeams();

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : undefined} />;

  return (
    <>
      <PageHeader title="Times" description="Conferencias, divisoes e elencos." />
      {data.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((team) => (
            <section key={team.id} className="rounded-lg border border-white/10 bg-panel/88 p-5 shadow-glow">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-slate-400">{team.city}</p>
                  <h3 className="truncate text-2xl font-bold text-white">{team.name}</h3>
                </div>
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-rim text-lg font-black text-ink">
                  {team.abbreviation}
                </div>
              </div>
              <dl className="mt-5 grid grid-cols-3 gap-3 text-sm">
                <div>
                  <dt className="text-slate-500">Conf.</dt>
                  <dd className="mt-1 font-semibold text-white">{team.conference}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Divisao</dt>
                  <dd className="mt-1 font-semibold text-white">{team.division}</dd>
                </div>
                <div>
                  <dt className="text-slate-500">Elenco</dt>
                  <dd className="mt-1 font-semibold text-white">{team._count?.players ?? 0}</dd>
                </div>
              </dl>
              <Link to={`/players?teamId=${team.id}`} className="mt-5 inline-flex h-10 items-center rounded-lg border border-white/10 px-3 text-sm text-slate-200 hover:bg-white/10">
                Ver jogadores
              </Link>
            </section>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}

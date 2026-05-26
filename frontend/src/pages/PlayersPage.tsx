import { Search } from "lucide-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { PlayerTable } from "../components/PlayerTable";
import { usePlayers } from "../hooks/useApi";

export function PlayersPage() {
  const [search, setSearch] = useState("");
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("teamId");
  const { data, isLoading, error } = usePlayers(search, teamId);

  return (
    <>
      <PageHeader
        title="Jogadores"
        description="Elenco, posicoes e medias por jogo."
        actions={
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar"
              className="h-10 w-64 max-w-full rounded-lg border border-white/10 bg-panel pl-9 pr-3 text-sm text-white outline-none focus:border-rim"
            />
          </label>
        }
      />
      {isLoading ? <LoadingState /> : null}
      {error ? <ErrorState message={error instanceof Error ? error.message : undefined} /> : null}
      {data?.length ? <PlayerTable players={data} /> : !isLoading && !error ? <EmptyState /> : null}
    </>
  );
}

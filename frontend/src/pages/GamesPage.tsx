import { GameCard } from "../components/GameCard";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { LoadingState } from "../components/LoadingState";
import { PageHeader } from "../components/PageHeader";
import { useGames } from "../hooks/useApi";

export function GamesPage() {
  const { data, isLoading, error } = useGames();

  if (isLoading) return <LoadingState />;
  if (error || !data) return <ErrorState message={error instanceof Error ? error.message : undefined} />;

  return (
    <>
      <PageHeader title="Jogos" description="Calendario, placares e status da temporada." />
      {data.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}

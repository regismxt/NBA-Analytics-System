import type {
  DashboardSummary,
  Game,
  Player,
  PlayerComparison,
  PlayerGameStat,
  RankingRow,
  Team,
  TopPerformers
} from "../types/models";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}${path}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message ?? `API error: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/health"),
  dashboard: () => request<DashboardSummary>("/analytics/summary"),
  teams: () => request<Team[]>("/teams"),
  team: (id: string | number) => request<Team>(`/teams/${id}`),
  players: (search?: string, teamId?: string | number) => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (teamId) params.set("teamId", String(teamId));
    const suffix = params.toString() ? `?${params.toString()}` : "";
    return request<Player[]>(`/players${suffix}`);
  },
  player: (id: string | number) => request<Player>(`/players/${id}`),
  games: () => request<Game[]>("/games"),
  game: (id: string | number) => request<Game>(`/games/${id}`),
  gameStats: (id: string | number) => request<PlayerGameStat[]>(`/games/${id}/player-stats`),
  liveGames: () => request<Game[]>("/games/live"),
  rankingPoints: () => request<RankingRow[]>("/rankings/points"),
  rankingAssists: () => request<RankingRow[]>("/rankings/assists"),
  rankingRebounds: () => request<RankingRow[]>("/rankings/rebounds"),
  topPerformers: () => request<TopPerformers>("/analytics/top-performers"),
  comparePlayers: (playerAId: number, playerBId: number) =>
    request<PlayerComparison>(`/analytics/player-comparison?playerAId=${playerAId}&playerBId=${playerBId}`)
};

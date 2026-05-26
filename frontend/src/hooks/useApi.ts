import { useQuery } from "@tanstack/react-query";
import { api } from "../services/api";

export function useDashboard() {
  return useQuery({ queryKey: ["dashboard"], queryFn: api.dashboard });
}

export function useGames() {
  return useQuery({ queryKey: ["games"], queryFn: api.games });
}

export function useGame(id: string | undefined) {
  return useQuery({
    queryKey: ["game", id],
    queryFn: () => api.game(id!),
    enabled: Boolean(id)
  });
}

export function useGameStats(id: string | undefined) {
  return useQuery({
    queryKey: ["game-stats", id],
    queryFn: () => api.gameStats(id!),
    enabled: Boolean(id)
  });
}

export function usePlayers(search = "", teamId?: string | number | null) {
  return useQuery({
    queryKey: ["players", search, teamId],
    queryFn: () => api.players(search, teamId ?? undefined)
  });
}

export function usePlayer(id: string | undefined) {
  return useQuery({
    queryKey: ["player", id],
    queryFn: () => api.player(id!),
    enabled: Boolean(id)
  });
}

export function useTeams() {
  return useQuery({ queryKey: ["teams"], queryFn: api.teams });
}

export function useTopPerformers() {
  return useQuery({ queryKey: ["top-performers"], queryFn: api.topPerformers });
}

import { Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import type { Game } from "../types/models";
import { formatDate, statusTone } from "../utils/format";

type GameCardProps = {
  game: Game;
};

export function GameCard({ game }: GameCardProps) {
  return (
    <Link
      to={`/games/${game.id}`}
      className="block rounded-lg border border-white/10 bg-panel/88 p-4 transition hover:border-rim/40 hover:bg-white/5"
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <span className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(game.status)}`}>
          {game.status}
        </span>
        <span className="flex items-center gap-1 text-xs text-slate-400">
          <Clock3 size={14} />
          {formatDate(game.gameDate)}
        </span>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-400">{game.awayTeam.city}</p>
            <p className="truncate text-lg font-semibold text-white">{game.awayTeam.abbreviation}</p>
          </div>
          <p className="w-12 text-right text-2xl font-bold text-white">{game.awayScore}</p>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm text-slate-400">{game.homeTeam.city}</p>
            <p className="truncate text-lg font-semibold text-white">{game.homeTeam.abbreviation}</p>
          </div>
          <p className="w-12 text-right text-2xl font-bold text-white">{game.homeScore}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-slate-400">
        <span>Periodo {game.period}</span>
        <span>{game.clock ?? "--"}</span>
      </div>
    </Link>
  );
}

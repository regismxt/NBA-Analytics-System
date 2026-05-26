import { Link } from "react-router-dom";
import type { RankingRow } from "../types/models";
import { formatNumber } from "../utils/format";

type RankingTableProps = {
  rows: RankingRow[];
  label: string;
};

export function RankingTable({ rows, label }: RankingTableProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-panel/88">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-400">
            <tr>
              <th className="w-14 px-4 py-3">#</th>
              <th className="px-4 py-3">Jogador</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3 text-right">{label}</th>
              <th className="px-4 py-3 text-right">Media</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row, index) => (
              <tr key={row.playerId} className="hover:bg-white/5">
                <td className="px-4 py-3 text-slate-400">{index + 1}</td>
                <td className="px-4 py-3">
                  <Link to={`/players/${row.playerId}`} className="font-semibold text-white hover:text-rim">
                    {row.fullName}
                  </Link>
                  <p className="text-xs text-slate-500">{row.position}</p>
                </td>
                <td className="px-4 py-3 text-slate-300">{row.team}</td>
                <td className="px-4 py-3 text-right font-semibold text-white">{formatNumber(row.total, 1)}</td>
                <td className="px-4 py-3 text-right text-slate-300">{formatNumber(row.average, 1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

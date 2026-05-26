import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import type { Player } from "../types/models";
import { formatNumber } from "../utils/format";

type PlayerTableProps = {
  players: Player[];
};

const columnHelper = createColumnHelper<Player>();

const columns = [
  columnHelper.accessor("fullName", {
    header: "Jogador",
    cell: (info) => (
      <Link to={`/players/${info.row.original.id}`} className="font-semibold text-white hover:text-rim">
        {info.getValue()}
      </Link>
    )
  }),
  columnHelper.accessor("team.abbreviation", {
    header: "Time",
    cell: (info) => <span className="text-slate-300">{info.getValue()}</span>
  }),
  columnHelper.accessor("position", {
    header: "Pos.",
    cell: (info) => <span className="text-slate-300">{info.getValue()}</span>
  }),
  columnHelper.accessor((row) => row.averages?.points ?? 0, {
    id: "points",
    header: "PTS",
    cell: (info) => <span className="tabular-nums">{formatNumber(info.getValue(), 1)}</span>
  }),
  columnHelper.accessor((row) => row.averages?.rebounds ?? 0, {
    id: "rebounds",
    header: "REB",
    cell: (info) => <span className="tabular-nums">{formatNumber(info.getValue(), 1)}</span>
  }),
  columnHelper.accessor((row) => row.averages?.assists ?? 0, {
    id: "assists",
    header: "AST",
    cell: (info) => <span className="tabular-nums">{formatNumber(info.getValue(), 1)}</span>
  }),
  columnHelper.accessor((row) => row.averages?.efficiency ?? 0, {
    id: "efficiency",
    header: "EFF",
    cell: (info) => <span className="tabular-nums text-mint">{formatNumber(info.getValue(), 1)}</span>
  })
];

export function PlayerTable({ players }: PlayerTableProps) {
  const table = useReactTable({
    data: players,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="overflow-hidden rounded-lg border border-white/10 bg-panel/88">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left text-xs uppercase text-slate-400">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-white/10">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/5">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3 text-slate-200">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

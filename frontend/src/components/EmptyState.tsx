type EmptyStateProps = {
  title?: string;
};

export function EmptyState({ title = "Nenhum registro encontrado." }: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-panel/80 p-6 text-center text-sm text-slate-400">
      {title}
    </div>
  );
}

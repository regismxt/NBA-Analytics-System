type ErrorStateProps = {
  message?: string;
};

export function ErrorState({ message = "Nao foi possivel carregar os dados." }: ErrorStateProps) {
  return (
    <div className="rounded-lg border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">
      {message}
    </div>
  );
}

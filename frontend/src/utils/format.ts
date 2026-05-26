export function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

export function formatNumber(value: number | undefined, digits = 1) {
  if (value === undefined || Number.isNaN(value)) return "0";
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: digits,
    minimumFractionDigits: value % 1 === 0 ? 0 : digits
  });
}

export function statusTone(status: string) {
  if (status === "LIVE") return "border-court/40 bg-court/10 text-orange-200";
  if (status === "FINAL") return "border-mint/30 bg-mint/10 text-teal-100";
  return "border-rim/30 bg-rim/10 text-sky-100";
}

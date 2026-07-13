export function getTodayISO(): string {
  return new Date().toISOString().split("T")[0];
}

export function getFutureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

export function isExpired(isoDate: string): boolean {
  return new Date(isoDate) < new Date();
}

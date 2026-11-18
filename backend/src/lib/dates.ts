const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function chargeableDays(start: Date, end: Date) {
  return Math.ceil((end.getTime() - start.getTime()) / DAY_IN_MS);
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const localDateFormatter = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" });

export function today() {
  return new Date(localDateFormatter.format(new Date()));
}

export function daysBetween(start: Date, end: Date) {
  return Math.ceil((end.getTime() - start.getTime()) / DAY_IN_MS);
}

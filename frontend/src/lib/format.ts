import type { RentalStatus, VehicleCategory } from "../types";

const DAY_IN_MS = 24 * 60 * 60 * 1000;

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(value: string | number) {
  return currency.format(Number(value));
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function toInputDateTime(date: Date) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function addDays(date: Date, days: number) {
  return new Date(date.getTime() + days * DAY_IN_MS);
}

export function chargeableDays(start: string, end: string) {
  return Math.ceil((new Date(end).getTime() - new Date(start).getTime()) / DAY_IN_MS);
}

export const categoryLabels: Record<VehicleCategory, string> = {
  ECONOMY: "Econômico",
  HATCH: "Hatch",
  SEDAN: "Sedan",
  SUV: "SUV",
  PICKUP: "Picape",
};

export const rentalStatusLabels: Record<RentalStatus, string> = {
  ACTIVE: "Em andamento",
  FINISHED: "Finalizada",
};

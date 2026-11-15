import type { RentalStatus, VehicleCategory, VehicleStatus } from "../types";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function formatCurrency(value: string | number) {
  return currency.format(Number(value));
}

export function formatDate(value: string) {
  return new Date(value).toLocaleDateString("pt-BR", { timeZone: "UTC" });
}

export function formatDateTime(value: string) {
  return new Date(value).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

export function toInputDate(date: Date) {
  return date.toLocaleDateString("en-CA");
}

export function addDays(date: Date, days: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

export function daysBetween(start: string, end: string) {
  return Math.round((Date.parse(end) - Date.parse(start)) / 86_400_000);
}

export const categoryLabels: Record<VehicleCategory, string> = {
  ECONOMY: "Econômico",
  HATCH: "Hatch",
  SEDAN: "Sedan",
  SUV: "SUV",
  PICKUP: "Picape",
};

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  AVAILABLE: "Disponível",
  RENTED: "Locado",
  MAINTENANCE: "Manutenção",
};

export const rentalStatusLabels: Record<RentalStatus, string> = {
  ACTIVE: "Em andamento",
  RETURNED: "Devolvido",
};

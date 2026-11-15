import type { ReactNode } from "react";
import { categoryLabels, formatCurrency, vehicleStatusLabels } from "../lib/format";
import type { Vehicle, VehicleStatus } from "../types";
import { Badge, CarIcon } from "./ui";

const statusTones: Record<VehicleStatus, "green" | "amber" | "slate"> = {
  AVAILABLE: "green",
  RENTED: "amber",
  MAINTENANCE: "slate",
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge tone={statusTones[status]}>{vehicleStatusLabels[status]}</Badge>;
}

export function VehicleImage({ vehicle, className = "" }: { vehicle: Vehicle; className?: string }) {
  if (vehicle.imageUrl) {
    return <img src={vehicle.imageUrl} alt={`${vehicle.brand} ${vehicle.model}`} className={`object-cover ${className}`} />;
  }

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 text-slate-400 ${className}`}>
      <CarIcon className="size-16" />
    </div>
  );
}

export function VehicleCard({ vehicle, actions }: { vehicle: Vehicle; actions?: ReactNode }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <VehicleImage vehicle={vehicle} className="aspect-[16/9] w-full" />

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="font-semibold text-slate-900">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-sm text-slate-500">
              {vehicle.year} · {vehicle.color} · {categoryLabels[vehicle.category]}
            </p>
          </div>
          <VehicleStatusBadge status={vehicle.status} />
        </div>

        <div className="mt-4 flex items-end justify-between">
          <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs tracking-wider text-slate-600">{vehicle.plate}</span>
          <p className="text-right">
            <span className="text-lg font-semibold text-slate-900">{formatCurrency(vehicle.dailyRate)}</span>
            <span className="text-sm text-slate-500"> /dia</span>
          </p>
        </div>

        {actions && <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">{actions}</div>}
      </div>
    </article>
  );
}

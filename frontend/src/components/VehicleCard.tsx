import type { ReactNode } from "react";
import { categoryIllustrations } from "../lib/illustrations";
import { categoryLabels, formatCurrency, vehicleStatusLabels } from "../lib/format";
import { vehiclePhoto } from "../lib/vehiclePhotos";
import type { Vehicle, VehicleStatus } from "../types";
import { Badge, Card, Illustration } from "./ui";

const statusTones: Record<VehicleStatus, "green" | "orange" | "slate"> = {
  AVAILABLE: "green",
  RENTED: "orange",
  MAINTENANCE: "slate",
};

export function VehicleStatusBadge({ status }: { status: VehicleStatus }) {
  return <Badge tone={statusTones[status]}>{vehicleStatusLabels[status]}</Badge>;
}

type VehicleIdentity = Pick<Vehicle, "brand" | "model" | "category" | "imageUrl">;

export function VehicleImage({ vehicle, className = "" }: { vehicle: VehicleIdentity; className?: string }) {
  const name = `${vehicle.brand} ${vehicle.model}`;

  if (vehicle.imageUrl) {
    return <img src={vehicle.imageUrl} alt={name} className={`object-cover ${className}`} />;
  }

  const photo = vehiclePhoto(vehicle);

  return (
    <div className={`flex items-center justify-center bg-gradient-to-br from-brand-100/70 via-brand-50/40 to-slate-50 ${className}`}>
      {photo ? (
        <img
          src={photo}
          alt={name}
          draggable={false}
          className="w-[84%] object-contain drop-shadow-[0_18px_18px_rgba(16,23,39,0.22)]"
        />
      ) : (
        <Illustration src={categoryIllustrations[vehicle.category]} className="h-[70%] w-auto drop-shadow-xl" />
      )}
    </div>
  );
}

export function VehicleThumb({ vehicle, className = "h-12 w-16" }: { vehicle: VehicleIdentity; className?: string }) {
  const photo = vehicle.imageUrl ?? vehiclePhoto(vehicle);

  return (
    <span className={`flex shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-brand-50 ${className}`}>
      {photo ? (
        <img
          src={photo}
          alt=""
          aria-hidden="true"
          className={vehicle.imageUrl ? "size-full object-cover" : "w-[88%] object-contain drop-shadow-md"}
        />
      ) : (
        <Illustration src={categoryIllustrations[vehicle.category]} className="h-2/3 w-auto" />
      )}
    </span>
  );
}

export function VehicleCard({ vehicle, actions }: { vehicle: Vehicle; actions?: ReactNode }) {
  return (
    <Card className="group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70">
      <div className="relative p-2">
        <VehicleImage vehicle={vehicle} className="aspect-[16/10] w-full rounded-2xl" />
        <div className="absolute left-5 top-5">
          <VehicleStatusBadge status={vehicle.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col px-5 pb-5 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">{categoryLabels[vehicle.category]}</p>
        <h2 className="mt-1 text-lg font-bold tracking-tight text-ink">
          {vehicle.brand} {vehicle.model}
        </h2>
        <p className="text-sm text-slate-500">
          {vehicle.year} · {vehicle.color} · <span className="font-mono">{vehicle.plate}</span>
        </p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <p>
            <span className="text-xl font-bold tracking-tight text-ink">{formatCurrency(vehicle.dailyRate)}</span>
            <span className="text-sm text-slate-500"> /dia</span>
          </p>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>
      </div>
    </Card>
  );
}

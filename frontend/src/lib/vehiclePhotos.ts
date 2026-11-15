import cretaImage from "../assets/hyundai-creta.webp";
import compassImage from "../assets/jeep-compass.webp";
import type { Vehicle } from "../types";

const photos: Record<string, string> = {
  "hyundai creta": cretaImage,
  "jeep compass": compassImage,
};

export function vehiclePhoto(vehicle: Pick<Vehicle, "brand" | "model">) {
  return photos[`${vehicle.brand} ${vehicle.model}`.trim().toLowerCase()] ?? null;
}

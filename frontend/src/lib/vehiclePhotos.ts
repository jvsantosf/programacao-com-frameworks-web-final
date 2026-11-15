import mobiImage from "../assets/fiat-mobi.webp";
import toroImage from "../assets/fiat-toro.webp";
import cretaImage from "../assets/hyundai-creta.webp";
import compassImage from "../assets/jeep-compass.webp";
import corollaImage from "../assets/toyota-corolla.webp";
import poloImage from "../assets/volkswagen-polo.webp";
import type { Vehicle, VehicleCategory } from "../types";

const photos: Record<string, string> = {
  "fiat mobi": mobiImage,
  "fiat toro": toroImage,
  "hyundai creta": cretaImage,
  "jeep compass": compassImage,
  "toyota corolla": corollaImage,
  "volkswagen polo": poloImage,
};

export function vehiclePhoto(vehicle: Pick<Vehicle, "brand" | "model">) {
  return photos[`${vehicle.brand} ${vehicle.model}`.trim().toLowerCase()] ?? null;
}

export const categoryPhotos: Record<VehicleCategory, string> = {
  ECONOMY: mobiImage,
  HATCH: poloImage,
  SEDAN: corollaImage,
  SUV: compassImage,
  PICKUP: toroImage,
};

export type VehicleCategory = "ECONOMY" | "HATCH" | "SEDAN" | "SUV" | "PICKUP";
export type RentalStatus = "ACTIVE" | "FINISHED";

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  category: VehicleCategory;
  dailyRate: string;
  available: boolean;
}

export interface Rental {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: string;
  expectedReturnDate: string;
  returnedAt: string | null;
  dailyRate: string;
  totalAmount: string;
  status: RentalStatus;
  createdAt: string;
  vehicle: Vehicle;
}

export interface AuthResponse {
  user: User;
  token: string;
}

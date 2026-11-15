export type Role = "ADMIN" | "CUSTOMER";
export type VehicleCategory = "ECONOMY" | "HATCH" | "SEDAN" | "SUV" | "PICKUP";
export type VehicleStatus = "AVAILABLE" | "RENTED" | "MAINTENANCE";
export type RentalStatus = "ACTIVE" | "RETURNED";

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
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
  status: VehicleStatus;
  imageUrl: string | null;
}

export interface Rental {
  id: number;
  userId: number;
  vehicleId: number;
  startDate: string;
  expectedReturnDate: string;
  returnedAt: string | null;
  dailyRate: string;
  estimatedAmount: string;
  totalAmount: string | null;
  status: RentalStatus;
  createdAt: string;
  vehicle: Vehicle;
  user: Pick<User, "id" | "name" | "email">;
}

export interface AuthResponse {
  user: User;
  token: string;
}

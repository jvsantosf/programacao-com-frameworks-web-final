import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { RequireAuth } from "./components/RequireAuth";
import { AuthProvider } from "./contexts/AuthContext";
import { LoginPage, RegisterPage } from "./pages/AuthPages";
import { RentalsPage } from "./pages/RentalsPage";
import { RentVehiclePage } from "./pages/RentVehiclePage";
import { VehicleFormPage } from "./pages/VehicleFormPage";
import { VehiclesPage } from "./pages/VehiclesPage";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<VehiclesPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="rentals" element={<RequireAuth><RentalsPage /></RequireAuth>} />
            <Route path="vehicles/:id/rent" element={<RequireAuth><RentVehiclePage /></RequireAuth>} />
            <Route path="vehicles/new" element={<RequireAuth adminOnly><VehicleFormPage /></RequireAuth>} />
            <Route path="vehicles/:id/edit" element={<RequireAuth adminOnly><VehicleFormPage /></RequireAuth>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

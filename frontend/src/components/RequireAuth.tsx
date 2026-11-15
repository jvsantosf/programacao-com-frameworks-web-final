import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { Spinner } from "./ui";

export function RequireAuth({ children, adminOnly = false }: { children: ReactNode; adminOnly?: boolean }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/vehicles" replace />;

  return children;
}

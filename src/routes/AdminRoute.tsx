import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { ReactNode } from "react";

type AdminRouteProps = {
  children: ReactNode;
};

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return  (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>);
  }

  if (!user || user.rol !== "ADMIN") {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

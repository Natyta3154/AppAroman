import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import React from "react"; // 👈 necesario para el tipo React.ReactElement

export default function ProtectedRoute({ children }: { children: React.ReactElement }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Verificando sesión...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

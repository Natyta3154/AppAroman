

// ProtectedRoute actúa como un guardián para las rutas protegidas de la aplicación.
//  Maneja tres escenarios principales: mostrar un indicador de carga mientras se verifica la autenticación, 
// redirigir a los usuarios no autenticados a la página de inicio de sesión y permitir el acceso a los usuarios autenticados mostrando el contenido protegido.



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

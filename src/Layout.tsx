// src/Layout.tsx
import React from "react";
import Navbar from "./conponents/Navbar/Navbar";
import Footer from "./conponents/footer/Footer";
import { useAuth } from "./hooks/useAuth";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user, loading, logout} = useAuth();

  if (loading) {
    return <div>Cargando...</div>;
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar/>
      {/* Contenido principal ocupa todo el espacio disponible */}
      {children}

      <Footer />
    </div>
  );
}

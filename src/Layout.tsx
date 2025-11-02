import React from "react";
import Navbar from "./conponents/Navbar/Navbar";
import Footer from "./conponents/footer/Footer";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600 font-semibold">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" reverseOrder={false} />
      <main className="flex-1 w-full max-w-100% mx-auto px-0 sm:px-6 lg:px-0">
        {children}
      </main>
      <Footer />
    </div>
  );
}

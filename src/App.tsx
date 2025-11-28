import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Ofertas from "./pages/Ofertas";
import QuienesSomos from "./pages/QuienesSomos";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminPage from "./admin/AdminPage";
import { AdminRoute } from "./routes/AdminRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import ShoppingCarts from "./conponents/CarritoUI/CarritoUI.tsx";
import { CarritoProvider } from "./contex/CarritoContext.tsx";
import ProductoDetalle from "./pages/ProductoDetalle";
//import BlogSection from "./conponents/blog/BlogSection";
import BlogPage from "./pages/Blog";
import PostDetalle from "./pages/PostDetalle.tsx";
import { Toaster } from "react-hot-toast";
import ExitoPage from "./pages/ExitoPage.tsx";
import FalloPage from "./pages/FalloPage.tsx";
import PendientePage from "./pages/PendientePage.tsx";
import Perfil from "./pages/Perfil.tsx";

function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <Layout>
          <Toaster position="top-right" reverseOrder={false} />
          <Routes>
            {/* Inicio con sección de blog resumida */}
            <Route
              path="/"
              element={
                <>
                  <Home />
                  
                </>
              }
            />

            {/* Administración (ya protegida por AdminRoute) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
             {/* Pedidos*/}
            <Route path="/checkout/exito" element={<ExitoPage />} />
            <Route path="/checkout/fallo" element={<FalloPage />} />
            <Route path="/checkout/pendiente" element={<PendientePage />} />

            {/* Productos */}
            <Route path="/productos" element={<Productos />} />
            <Route path="/productos/:id" element={<ProductoDetalle />} />
            <Route path="/ofertas" element={<Ofertas />} />

            {/* Páginas informativas */}
            <Route path="/quienes-somos" element={<QuienesSomos />} />
            <Route path="/contacto" element={<Contacto />} />

            {/* Autenticación */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/perfil" element={<Perfil />} />

            {/* Carrito protegido */}
            <Route
              path="/carrito"
              element={
                <ProtectedRoute>
                  <ShoppingCarts />
                </ProtectedRoute>
              }
            />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/blog/:id" element={<PostDetalle />} />
          </Routes>
        </Layout>
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;

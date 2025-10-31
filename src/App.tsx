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
import ShoppingCarts from "./conponents/CarritoUI/CarritoUI.tsx";
import { CarritoProvider } from "./contex/CarritoContext.tsx";
import ProductoDetalle from "./pages/ProductoDetalle";
import BlogSection from "./conponents/blog/BlogSection"; // 👈 import correcto para sección resumida
import BlogPage from "./pages/Blog"; // página completa del blog
import PostDetalle from "./pages/PostDetalle.tsx";
import { Toaster } from "react-hot-toast";


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
                  <BlogSection />
                </>
              }
            />

            {/* Administración */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />

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

            {/* Carrito */}
            <Route path="/carrito" element={<ShoppingCarts />} />

            {/* Blog */}
            <Route path="/blog" element={<BlogPage />} />         {/* lista completa */}
            <Route path="/blog/:id" element={<PostDetalle />} />  {/* detalle de post */}
          </Routes>
        </Layout>
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;

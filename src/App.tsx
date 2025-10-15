import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./pages/Home";
import Productos from "./pages/Productos";
import Ofertas from "./pages/Ofertas";
import Blog from "./pages/Blog";
import QuienesSomos from "./pages/QuienesSomos";
import Contacto from "./pages/Contacto";
import Login from "./pages/Login";
//import Carrito from "./pages/Carrito";
import Register from "./pages/Register";
import AdminPage from "./admin/AdminPage";
//import { AuthProvider } from "./contex/AuthContext";
import { AuthProvider } from "./hooks/useAuth";
import { AdminRoute } from "./routes/AdminRoute";
import ShoppingCarts from "./conponents/CarritoUI/CarritoUI";
import { CarritoProvider } from "./contex/CarritoContext.tsx";
import ProductoDetalle from "./pages/ProductoDetalle";


function App() {
  return (
    <BrowserRouter>
      <CarritoProvider>
        <AuthProvider>
          <Layout>

            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Home />
                    <Blog />
                  </>
                }
              />
            {/* Rutas protegidas solo se renderizará AdminPage si AdminRoute permite el acceso.  */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                }
              />

              <Route path="/productos" element={<Productos />} />
              <Route path="/productos/:id" element={<ProductoDetalle />} />
              <Route path="/ofertas" element={<Ofertas />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/quienes-somos" element={<QuienesSomos />} />
              <Route path="/contacto" element={<Contacto />} />
              <Route path="/login" element={<Login />} />
              <Route path="/carrito" element={<ShoppingCarts />} />
              <Route path="/register" element={<Register />} />




            </Routes>
          </Layout>
        </AuthProvider>
      </CarritoProvider>
    </BrowserRouter>
  );
}

export default App;



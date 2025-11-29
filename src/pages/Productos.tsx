import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ShoppingBag, ChevronDown, ChevronUp, Filter, Heart } from "lucide-react"; 

import { useProductos } from "../hooks/useproductos";
import type { ProductoResumen, Producto } from "../types/producto";
import { useCarrito } from "../contex/CarritoContext.tsx";

export default function Productos() {
    const { productos, loading, page, hasMore, fetchProductos } = useProductos();

    const [cart, setCart] = useState<ProductoResumen[]>([]);
    const { agregarProducto } = useCarrito();
    
    // Estados de Filtro Reales
    const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null);
    const [filtroPrecioMin, setFiltroPrecioMin] = useState<number | null>(null);
    const [filtroPrecioMax, setFiltroPrecioMax] = useState<number | null>(null);
    const [filtroDestacado, setFiltroDestacado] = useState<boolean | null>(null);
    const [filtrosAtributos, setFiltrosAtributos] = useState<Record<string, string | null>>({});

    // Estados Temporales para los Inputs de Precio
    const [precioMinInput, setPrecioMinInput] = useState<number | null>(null);
    const [precioMaxInput, setPrecioMaxInput] = useState<number | null>(null);
    const [mostrarFiltrosPrecio, setMostrarFiltrosPrecio] = useState(false); 

    // Lógica de estado (se mantiene igual)
    useEffect(() => {
        setPrecioMinInput(filtroPrecioMin);
        setPrecioMaxInput(filtroPrecioMax);
    }, [filtroPrecioMin, filtroPrecioMax]);

    useEffect(() => {
        const storedCart = localStorage.getItem("cart");
        if (storedCart) setCart(JSON.parse(storedCart));
    }, []);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: ProductoResumen | Producto) => {
        setCart((prev) => {
            const exists = prev.find((p) => p.id === product.id);
            if (exists) {
                return prev.map((p) =>
                    p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
        agregarProducto(product as Producto);
    };

    const formatPrice = (precio: number) =>
        new Intl.NumberFormat("es-AR", {
            style: "currency",
            currency: "ARS",
            minimumFractionDigits: 0,
        }).format(precio);

    // Lógica de Filtrado (Se mantiene la última versión robusta)
    const productosFiltrados = productos.filter(p => {
        const catNombre = (p.categoriaNombre ?? "").trim().toLowerCase();
        const filtroCat = filtroCategoria?.trim().toLowerCase();

        if (filtroCat && catNombre !== filtroCat) return false;
        if (filtroDestacado !== null && p.destacado !== filtroDestacado) return false;

        const precioBase = p.precio; 
        const precioNumerico = typeof precioBase === 'number' ? precioBase : Number(precioBase);
        
        const tieneFiltroPrecio = filtroPrecioMin !== null || filtroPrecioMax !== null;
        
        if (tieneFiltroPrecio && (isNaN(precioNumerico) || precioBase === undefined || precioBase === null)) {
            return false;
        }

        if (filtroPrecioMin !== null && precioNumerico < filtroPrecioMin) return false;
        if (filtroPrecioMax !== null && precioNumerico > filtroPrecioMax) return false;

        for (const [atrib, val] of Object.entries(filtrosAtributos)) {
            if (val && !(p.atributos?.some(a => (a.nombre ?? "").toLowerCase() === atrib.toLowerCase() && a.valor === val))) {
                return false;
            }
        }

        return true;
    });

    // Variant de Framer Motion para la lista de productos
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.07
            }
        }
    };
    
    // Variant de Framer Motion para cada item (tarjeta)
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        // 💡 CAMBIO 1: Aplicación del degradado solicitado en el fondo.
        <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-16 px-4">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 text-center tracking-tight">
                    🌸 Catálogo Premium
                </h1>
                <p className="text-center text-gray-800 mb-12 text-xl font-light">
                    Encuentra el producto perfecto para tu hogar y bienestar.
                </p>

                {/* FILTROS CONTENEDOR */}
                <div className="from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-16 px-4 p-6 rounded-xl mb-10 ">
                    <div className="flex flex-wrap gap-4 items-center justify-start sm:justify-center">
                        
                        {/* FILTRO CATEGORÍA */}
                        <div className="relative">
                            <select
                                value={filtroCategoria || ""}
                                onChange={(e) => setFiltroCategoria(e.target.value || null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500 appearance-none pr-8 transition-all"
                            >
                                <option value="">Todas las Categorías</option>
                                {["Sahumerios", "Difusores", "Velas"].map((cat) => (
                                    <option key={`fija-${cat}`} value={cat}>{cat}</option>
                                ))}
                                {Array.from(
                                    new Set(
                                        productos
                                            .map((p) => p.categoriaNombre)
                                            .filter((cat) => cat && !["Sahumerios", "Difusores", "Velas"].includes(cat))
                                    )
                                ).map((cat) => (
                                    <option key={`dinamica-${cat}`} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                        </div>


                        {/* BOTÓN DE TOGGLE PARA EL FILTRADO DE PRECIO */}
                        <motion.button
                            onClick={() => setMostrarFiltrosPrecio(prev => !prev)}
                            className="px-4 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2 shadow-md font-medium"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Filter className="w-4 h-4" />
                            Precio {mostrarFiltrosPrecio ? "Ocultar" : "Mostrar"}
                        </motion.button>
                        
                        {/* BOTÓN LIMPIAR TODOS LOS FILTROS */}
                        <motion.button
                            onClick={() => {
                                setFiltroCategoria(null);
                                setFiltrosAtributos({});
                                setFiltroPrecioMin(null);
                                setFiltroPrecioMax(null);
                                setFiltroDestacado(null);
                                setPrecioMinInput(null);
                                setPrecioMaxInput(null);
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium shadow-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Limpiar Filtros
                        </motion.button>
                    </div>

                    {/* CONTENEDOR CONDICIONAL CON INPUTS Y BOTONES DE PRECIO */}
                    {mostrarFiltrosPrecio && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="pt-4 mt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-center"
                        >
                            <label className="text-gray-600 font-medium">Rango de Precio:</label>
                            <input
                                type="number"
                                placeholder="Mín."
                                value={precioMinInput ?? ""}
                                onChange={(e) => setPrecioMinInput(e.target.value ? Number(e.target.value) : null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500 w-24 sm:w-32"
                            />
                            <span className="text-gray-500">-</span>
                            <input
                                type="number"
                                placeholder="Máx."
                                value={precioMaxInput ?? ""}
                                onChange={(e) => setPrecioMaxInput(e.target.value ? Number(e.target.value) : null)}
                                className="px-4 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:ring-purple-500 focus:border-purple-500 w-24 sm:w-32"
                            />

                            {/* BOTÓN FILTRAR */}
                            <motion.button
                                onClick={() => {
                                    setFiltroPrecioMin(precioMinInput);
                                    setFiltroPrecioMax(precioMaxInput);
                                }}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-colors font-medium shadow-md"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Aplicar
                            </motion.button>
                            
                            {/* BOTÓN LIMPIAR RANGO */}
                            <motion.button
                                onClick={() => {
                                    setPrecioMinInput(null);
                                    setPrecioMaxInput(null);
                                    setFiltroPrecioMin(null);
                                    setFiltroPrecioMax(null);
                                }}
                                className="px-4 py-2 bg-yellow-500 text-gray-800 rounded-lg hover:bg-yellow-400 transition-colors font-medium shadow-md"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Reset Rango
                            </motion.button>
                        </motion.div>
                    )}
                </div>
                
                {/* GRID DE PRODUCTOS */}
                <motion.div 
                    className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    {productosFiltrados.map((producto) => {
                        const ofertaActiva = producto.ofertas?.find((oferta) => oferta.estado === true);
                        const precioConDescuento = producto.precioConDescuento;

                        return (
                            <motion.div
                                key={producto.id}
                                variants={itemVariants}
                                whileHover={{ scale: 1.03, boxShadow: "0 10px 15px rgba(0, 0, 0, 0.1)" }}
                                whileTap={{ scale: 0.99 }}
                                className="relative bg-white rounded-xl shadow-lg transition-all duration-300 overflow-hidden group border border-gray-100"
                            >
                                {/* Imagen */}
                                <div className="relative overflow-hidden">
                                    <img
                                        src={producto.imagenUrl}
                                        alt={producto.nombre}
                                        className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                    />

                                    {/* Overlay detalle y botón de Wishlist */}
                                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                                        <Link
                                            to={`/productos/${producto.id}`}
                                            className="bg-white rounded-full p-3 shadow-lg hover:bg-purple-600 hover:text-white text-gray-800 flex items-center gap-2 font-semibold transition-colors"
                                        >
                                            <span className="text-xl">👁️</span>
                                            Ver Detalle
                                        </Link>
                                    </div>
                                    <button className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg text-gray-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                                        <Heart className="w-5 h-5" />
                                    </button>

                                    {/* Badges (Estilización más moderna) */}
                                    {producto.destacado && (
                                        <span className="absolute top-3 left-3 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                            🌟 Premium
                                        </span>
                                    )}

                                    {ofertaActiva && (
                                        <span className="absolute bottom-0 left-0 bg-red-600 text-white text-sm font-bold px-3 py-1 rounded-tr-xl shadow-md">
                                            {ofertaActiva.tipoDescuento === "PORCENTAJE"
                                                ? `${ofertaActiva.valorDescuento}% OFF`
                                                : "OFERTA"}
                                        </span>
                                    )}
                                </div>

                                {/* Info del producto */}
                                <div className="p-5 flex flex-col justify-between min-h-[140px]">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1 hover:text-purple-600 transition-colors">
                                            <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                                            {producto.descripcion}
                                        </p>
                                    </div>

                                    {/* Precios y Botón */}
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            {ofertaActiva ? (
                                                <>
                                                    <p className="text-sm text-gray-400 line-through">
                                                        {formatPrice(producto.precio)}
                                                    </p>
                                                    <p className="text-2xl font-bold text-green-600">
                                                        {formatPrice(precioConDescuento)}
                                                    </p>
                                                </>
                                            ) : (
                                                <p className="text-2xl font-bold text-purple-700">
                                                    {formatPrice(producto.precio)}
                                                </p>
                                            )}
                                        </div>

                                        {/* Botón agregar (más prominente) */}
                                        <motion.button
                                            whileHover={{ scale: 1.07 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => addToCart(producto)}
                                            className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 flex items-center gap-2 shadow-lg transition-all"
                                        >
                                            <ShoppingBag className="w-4 h-4" />
                                            Añadir
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>


                {/* BOTÓN CARGAR MÁS */}
                {hasMore && (
                    <div className="flex justify-center mt-12">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fetchProductos(page + 1)}
                            className="bg-purple-700 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-purple-600 shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? "Cargando..." : "Cargar más productos"}
                        </motion.button>
                    </div>
                )}
            </div>
        </main>
    );
}
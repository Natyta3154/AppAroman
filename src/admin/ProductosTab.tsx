// src/admin/ProductosTab.tsx
import { useEffect, useState } from "react";
import { useProductos } from "../hooks/useproductos";
import type { Producto } from "../types/producto";
import Modal from "./Modal";
import toast from "react-hot-toast";

export default function ProductosTab() {
  const {
    productos,
    fetchProductosAdmin,
    createProducto,
    updateProducto,
    removeProducto,
    categorias: categoriasHook,
    fragancias: fraganciasHook,
    atributos: atributosHook,
    fetchCategorias,
    fetchFragancias,
    fetchAtributos,
  } = useProductos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);

  // Estados del formulario
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState(0);
  const [precioMayorista, setPrecioMayorista] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoriaId, setCategoriaId] = useState<number | null>(null);
  const [imagenUrl, setImagenUrl] = useState("");
  const [activo, setActivo] = useState(true);
  const [destacado, setDestacado] = useState(false);
  const [fragancias, setFragancias] = useState<string[]>([]);
  const [atributos, setAtributos] = useState<{ nombre: string; valor: string }[]>([]);

  const categorias = categoriasHook;
  const fraganciasDisponibles = fraganciasHook.map(f => f.nombre);
  const atributosDisponibles = atributosHook.map(a => a.nombre);

  // =======================
  // Carga inicial
  // =======================
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        await fetchProductosAdmin();
        await fetchCategorias();
        await fetchFragancias();
        await fetchAtributos();
      } catch (err) {
        console.error("Error al cargar datos de admin:", err);
      }
    };
    cargarDatos();
  }, []);

  // =======================
  // Funciones CRUD
  // =======================
  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await removeProducto(id);
      toast.success("Producto eliminado ✅");
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar producto ❌");
    }
  };

  const handleEdit = (p: Producto) => {
    setEditProducto(p);
    setNombre(p.nombre);
    setDescripcion(p.descripcion || "");
    setPrecio(Number(p.precio));
    setPrecioMayorista(Number(p.precioMayorista));
    setStock(p.stock);
    setCategoriaId(p.categoriaId || null);
    setImagenUrl(p.imagenUrl || "");
    setActivo(p.activo);
    setDestacado(p.destacado || false);
    setFragancias(p.fragancias || []);
    setAtributos(p.atributos?.map(a => ({ nombre: a.nombre, valor: a.valor })) || []);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditProducto(null);
    setNombre("");
    setDescripcion("");
    setPrecio(0);
    setPrecioMayorista(0);
    setStock(0);
    setCategoriaId(null);
    setImagenUrl("");
    setActivo(true);
    setDestacado(false);
    setFragancias([]);
    setAtributos([]);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const payload: any = {
      nombre,
      descripcion,
      precio,
      precioMayorista,
      stock,
      categoriaId: categoriaId ?? null,
      imagenUrl,
      activo,
      destacado,
      fragancias,
      atributos,
    };

    try {
      if (editProducto) {
        await updateProducto(editProducto.id, payload);
        toast.success("Producto actualizado ✅");
      } else {
        await createProducto(payload);
        toast.success("Producto creado ✅");
      }
      setModalOpen(false);
      setEditProducto(null);
    } catch (err) {
      console.error(err);
      toast.error("Error al guardar producto ❌");
    }
  };

  // =======================
  // Render
  // =======================
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#E9D8FD] via-[#775c92] to-[#a06b9a] py-20 px-4 flex justify-center items-center">
      <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6 w-full max-w-6x2">
        <h2 className="text-2xl font-bold text-white mb-5 text-center">Productos Admin</h2>

        <div className="flex justify-center">
          <button
            onClick={handleCreate}
            className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400 transition"
          >
            Crear Producto
          </button>
        </div>

        <table className="min-w-full bg-gray-700 divide-x divide-gray-600 text-white rounded-lg overflow-hidden border border-gray-600">
          <thead>
            <tr className="bg-gray-600 divide-x divide-gray-500">
              <th className="px-4 py-2 border-b border-gray-500">ID</th>
              <th className="px-4 py-2 border-b border-gray-500">Nombre</th>
              <th className="px-4 py-2 border-b border-gray-500">Imagen</th>
              <th className="px-4 py-2 border-b border-gray-500">Precio</th>
              <th className="px-4 py-2 border-b border-gray-500">Precio Mayorista</th>
              <th className="px-4 py-2 border-b border-gray-500">Stock</th>
              <th className="px-4 py-2 border-b border-gray-500">Activo</th>
              <th className="px-4 py-2 border-b border-gray-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className="border-b divide-x divide-gray-600 border-gray-500 hover:bg-gray-600 transition text-center">
                <td className="px-4 py-2">{p.id}</td>
                <td className="px-4 py-2">{p.nombre}</td>
                <td className="px-4 py-2">
                  {p.imagenUrl ? (
                    <img src={p.imagenUrl} alt={p.nombre} className="w-16 h-16 object-cover mx-auto" />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td className="px-4 py-2">${p.precio}</td>
                <td className="px-4 py-2">${p.precioMayorista}</td>
                <td className="px-4 py-2">{p.stock}</td>
                <td className="px-4 py-2">{p.activo ? "Sí" : "No"}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => handleEdit(p)}
                    className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400 transition"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-400 transition"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title={editProducto ? "Editar Producto" : "Crear Producto"}
        >
          <div className="flex flex-col space-y-3 max-h-[80vh] overflow-y-auto text-white">
            <label>
              Nombre:
              <input
                type="text"
                placeholder="Ej. Vela aromática"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={nombre}
                onChange={e => setNombre(e.target.value)}
              />
            </label>

            <label>
              Descripción:
              <textarea
                placeholder="Ej. Aroma relajante de lavanda"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
              />
            </label>

            <label>
              Precio:
              <input
                type="number"
                placeholder="Ej. 1500"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={precio}
                onChange={e => setPrecio(Number(e.target.value))}
              />
            </label>

            <label>
              Precio Mayorista:
              <input
                type="number"
                placeholder="Ej. 1200"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={precioMayorista}
                onChange={e => setPrecioMayorista(Number(e.target.value))}
              />
            </label>

            <label>
              Stock:
              <input
                type="number"
                placeholder="Ej. 30"
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
              />
            </label>

            <label>
              Categoría:
              <select
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={categoriaId ?? ""}
                onChange={e => setCategoriaId(Number(e.target.value))}
              >
                <option value="">Seleccionar categoría</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </label>

            <label>
              URL de Imagen:
              <input
                type="text"
                placeholder="Ej. https://..."
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={imagenUrl}
                onChange={e => setImagenUrl(e.target.value)}
              />
            </label>

            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={activo} onChange={e => setActivo(e.target.checked)} />
              <span>Activo</span>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={destacado} onChange={e => setDestacado(e.target.checked)} />
              <span>Destacado</span>
            </div>

            {/* Fragancias */}
            <div>
              <label>Fragancias:</label>
              <select
                multiple
                className="w-full px-3 py-2 rounded bg-gray-700 text-white mt-1"
                value={fragancias}
                onChange={e => setFragancias(Array.from(e.target.selectedOptions, o => o.value))}
              >
                {fraganciasDisponibles.map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Atributos */}
            <div>
              <label>Atributos:</label>
              {atributos.map((a, i) => (
                <div key={i} className="flex space-x-2 mb-1 mt-1">
                  <input
                    type="text"
                    placeholder="Nombre del atributo"
                    className="px-2 py-1 rounded bg-gray-700 text-white"
                    value={a.nombre}
                    onChange={e => {
                      const copy = [...atributos];
                      copy[i].nombre = e.target.value;
                      setAtributos(copy);
                    }}
                  />
                  <input
                    type="text"
                    placeholder="Valor"
                    className="px-2 py-1 rounded bg-gray-700 text-white"
                    value={a.valor}
                    onChange={e => {
                      const copy = [...atributos];
                      copy[i].valor = e.target.value;
                      setAtributos(copy);
                    }}
                  />
                  <button
                    onClick={() => setAtributos(prev => prev.filter((_, idx) => idx !== i))}
                    className="px-2 py-1 bg-red-500 rounded hover:bg-red-400"
                  >
                    X
                  </button>
                </div>
              ))}
              <button
                onClick={() => setAtributos(prev => [...prev, { nombre: "", valor: "" }])}
                className="px-2 py-1 bg-indigo-500 rounded hover:bg-indigo-400 mt-1"
              >
                Agregar atributo
              </button>
            </div>

            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500 transition"
            >
              {editProducto ? "Guardar Cambios" : "Guardar Producto"}
            </button>



          </div>
        </Modal>

      </div>
    </main>
  );
}

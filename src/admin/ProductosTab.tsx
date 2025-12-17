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
    fetchCategorias,
    fetchFragancias,
    fetchAtributos,
  } = useProductos();

  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);

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

  useEffect(() => {
    const load = async () => {
      try {
        await fetchProductosAdmin();
        await fetchCategorias();
        await fetchFragancias();
        await fetchAtributos();
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar producto?")) return;
    try {
      await removeProducto(id);
      toast.success("Producto eliminado");
    } catch {
      toast.error("Error al eliminar producto");
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
      categoriaId,
      imagenUrl,
      activo,
      destacado,
      fragancias,
      atributos,
    };

    try {
      if (editProducto) {
        await updateProducto(editProducto.id, payload);
        toast.success("Producto actualizado");
      } else {
        await createProducto(payload);
        toast.success("Producto creado");
      }
      setModalOpen(false);
      setEditProducto(null);
    } catch {
      toast.error("Error al guardar producto");
    }
  };

  return (
    <div
      className="
        p-6 
        bg-white/20 backdrop-blur-xl 
        rounded-3xl shadow-xl 
        border border-white/30
        text-gray-900
      "
    >
      <h2 className="text-3xl font-bold mb-6 text-purple-800 cursor-pointer">
        Productos
      </h2>

      <button
        onClick={handleCreate}
        className="
          mb-6 px-5 py-2 
          bg-gradient-to-r from-purple-600 to-pink-500 
          text-white rounded-full 
          shadow-md hover:shadow-xl 
          transition-all duration-300
          cursor-pointer
        "
      >
        Crear Producto
      </button>

      <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg">
        <table className="min-w-full text-left text-gray-900">
          <thead>
            <tr className="bg-white/20 backdrop-blur-xl text-purple-900 font-semibold">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Imagen</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Mayorista</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.map(p => (
              <tr
                key={p.id}
                className="
                  border-b border-purple-200/30 
                  hover:bg-white/30 
                  transition
                "
              >
                <td className="px-4 py-3">{p.id}</td>
                <td className="px-4 py-3">{p.nombre}</td>
                <td className="px-4 py-3">
                  {p.imagenUrl ? (
                    <img
                      src={p.imagenUrl}
                      className="w-14 h-14 object-cover rounded-xl shadow-md"
                    />
                  ) : (
                    "Sin imagen"
                  )}
                </td>
                <td className="px-4 py-3">${p.precio}</td>
                <td className="px-4 py-3">${p.precioMayorista}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">{p.activo ? "Sí" : "No"}</td>

                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="
                      px-3 py-1 rounded-full 
                      bg-yellow-500 text-white 
                      hover:bg-yellow-400 
                      transition-all shadow
                      cursor-pointer
                    "
                  >
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="
                    cursor-pointer
                      px-3 py-1 rounded-full 
                      bg-red-500 text-white 
                      hover:bg-red-400 
                      transition-all shadow
                    "
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editProducto ? "Editar Producto" : "Crear Producto"}
      >
        <div className="flex flex-col space-y-3 text-white">

          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />

          <textarea
            placeholder="Descripción"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
          />

          <input
            type="number"
            placeholder="Precio"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Precio Mayorista"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={precioMayorista}
            onChange={e => setPrecioMayorista(Number(e.target.value))}
          />

          <input
            type="number"
            placeholder="Stock"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={stock}
            onChange={e => setStock(Number(e.target.value))}
          />

          <select
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={categoriaId ?? ""}
            onChange={e => setCategoriaId(Number(e.target.value))}
          >
            <option value="">Seleccionar categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>

          <input
            type="text"
            placeholder="URL de imagen"
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={imagenUrl}
            onChange={e => setImagenUrl(e.target.value)}
          />

          {/* Activo */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activo}
              onChange={e => setActivo(e.target.checked)}
            />
            <span>Activo</span>
          </label>

          {/* Destacado */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={destacado}
              onChange={e => setDestacado(e.target.checked)}
            />
            <span>Destacado</span>
          </label>

          {/* Fragancias */}
          <label>Fragancias:</label>
          <select
            multiple
            className="px-3 py-2 rounded bg-white/30 border border-white/40 backdrop-blur-lg"
            value={fragancias}
            onChange={e =>
              setFragancias(Array.from(e.target.selectedOptions, o => o.value))
            }
          >
            {fraganciasDisponibles.map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Atributos */}
          <label>Atributos:</label>
          {atributos.map((a, i) => (
            <div key={i} className="flex gap-2">
              <input
                type="text"
                placeholder="Nombre"
                className="px-2 py-1 rounded bg-white/30 border border-white/40 text-sm"
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
                className="px-2 py-1 rounded bg-white/30 border border-white/40 text-sm"
                value={a.valor}
                onChange={e => {
                  const copy = [...atributos];
                  copy[i].valor = e.target.value;
                  setAtributos(copy);
                }}
              />
              <button
                onClick={() =>
                  setAtributos(prev => prev.filter((_, idx) => idx !== i))
                }
                className="px-2 py-1 bg-red-500 text-white rounded-full hover:bg-red-400 text-sm"
              >
                X
              </button>
            </div>
          ))}

          <button
            onClick={() =>
              setAtributos(prev => [...prev, { nombre: "", valor: "" }])
            }
            className="
            cursor-pointer
              px-3 py-2 
              bg-gradient-to-r from-purple-600 to-pink-500 
              text-white rounded-full 
              shadow-md hover:shadow-xl 
              transition-all
            "
          >
            Agregar atributo
          </button>

          <button
            onClick={handleSave}
            className="
            cursor-pointer
              mt-3 px-4 py-2 
              bg-gradient-to-r from-purple-600 to-pink-500 
              text-white rounded-full 
              shadow-md hover:shadow-xl 
              transition-all duration-300
            "
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

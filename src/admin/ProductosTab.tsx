// src/admin/ProductosTab.tsx
import { useEffect, useState } from "react";
import { productosService } from "../services/productoService";
import type { Producto } from "../types/producto";
import Modal from "./Modal";

export default function ProductosTab() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProducto, setEditProducto] = useState<Producto | null>(null);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState(0);
  const [stock, setStock] = useState(0);
  const [oferta, setOferta] = useState(false);

  const fetchProductos = async () => {
    const data = await productosService.getAll();
    setProductos(data);
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar producto?")) {
      await productosService.remove(id);
      fetchProductos();
    }
  };

  const handleSave = async () => {
    if (editProducto) {
      await productosService.update(editProducto.id, { nombre, precio, stock, ofertas, descuento: editProducto.descuento ?? 0 });
    } else {
      await productosService.create({ nombre, precio, stock, ofertas, descuento: 0 });
    }
    setModalOpen(false);
    setEditProducto(null);
    setNombre("");
    setPrecio(0);
    setStock(0);
    setOferta(false);
    fetchProductos();
  };

  const handleEdit = (producto: Producto) => {
    setEditProducto(producto);
    setNombre(producto.nombre);
    setPrecio(producto.precio);
    setStock(producto.stock);
    setOferta(producto.oferta);
    setModalOpen(true);
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-bold text-white mb-4">Productos / Ofertas</h2>
      <button
        onClick={() => setModalOpen(true)}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400"
      >
        Crear Producto
      </button>

      <table className="min-w-full bg-gray-700 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Precio</th>
            <th className="px-4 py-2">Stock</th>
            <th className="px-4 py-2">Oferta</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map(p => (
            <tr key={p.id} className="border-b border-gray-500">
              <td className="px-4 py-2">{p.id}</td>
              <td className="px-4 py-2">{p.nombre}</td>
              <td className="px-4 py-2">{p.precio}</td>
              <td className="px-4 py-2">{p.stock}</td>
              <td className="px-4 py-2">{p.oferta ? "Sí" : "No"}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(p)}
                  className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-400"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editProducto ? "Editar Producto" : "Crear Producto"}>
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="number"
            placeholder="Precio"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={precio}
            onChange={e => setPrecio(Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Stock"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={stock}
            onChange={e => setStock(Number(e.target.value))}
          />
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={oferta}
              onChange={e => setOferta(e.target.checked)}
            />
            <span>Oferta</span>
          </label>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400"
          >
            Guardar
          </button>
        </div>
      </Modal>
    </div>
  );
}

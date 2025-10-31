// src/admin/UsuariosTab.tsx
import { useState } from "react";
import type { Usuario } from "../types/usuario";
import Modal from "./Modal";
import { useUsuarios } from "../hooks/useUsuarios";

export default function UsuariosTab() {
  const { usuarios, loading, error, createUsuario, updateUsuario, deleteUsuario } = useUsuarios();

  const [modalOpen, setModalOpen] = useState(false);
  const [editUsuario, setEditUsuario] = useState<Usuario | null>(null);

  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<"ADMIN" | "USER">("USER");

  const handleEdit = (usuario: Usuario) => {
    setEditUsuario(usuario);
    setNombre(usuario.nombre);
    setEmail(usuario.email);
    setRol(usuario.rol);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditUsuario(null);
    setNombre("");
    setEmail("");
    setRol("USER");
    setModalOpen(true);
  };

  const handleSave = async () => {
    try {
      if (editUsuario) {
        await updateUsuario(editUsuario.id, { nombre, email, rol });
      } else {
        await createUsuario({ nombre, email, rol });
      }
      setModalOpen(false);
      setEditUsuario(null);
      setNombre("");
      setEmail("");
      setRol("USER");
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al guardar el usuario");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("¿Eliminar usuario?")) return;
    try {
      await deleteUsuario(id);
    } catch (err) {
      console.error(err);
      alert("Ocurrió un error al eliminar el usuario");
    }
  };

  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-white mb-4">Usuarios</h2>
      <button
        onClick={handleCreate}
        className="mb-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400"
      >
        Crear Usuario
      </button>

      {loading && <p className="text-white mb-4">Cargando usuarios...</p>}
      {error && <p className="text-red-400 mb-4">{error}</p>}

      <table className="min-w-full bg-gray-700 text-white rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-600">
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map(u => (
            <tr key={u.id} className="border-b border-gray-500">
              <td className="px-4 py-2">{u.id}</td>
              <td className="px-4 py-2">{u.nombre}</td>
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{u.rol}</td>
              <td className="px-4 py-2 space-x-2">
                <button
                  onClick={() => handleEdit(u)}
                  className="px-2 py-1 bg-yellow-500 rounded hover:bg-yellow-400"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-2 py-1 bg-red-500 rounded hover:bg-red-400"
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
        title={editUsuario ? "Editar Usuario" : "Crear Usuario"}
      >
        <div className="flex flex-col space-y-2">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded bg-gray-700 text-white"
            value={rol}
            onChange={e => setRol(e.target.value as "ADMIN" | "USER")}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
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

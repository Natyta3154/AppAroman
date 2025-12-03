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
    <div className="
      p-6 
      bg-white/20 backdrop-blur-xl 
      rounded-3xl shadow-xl 
      border border-white/30
      text-gray-900
    ">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">
        Usuarios
      </h2>

      <button
        onClick={handleCreate}
        className="
          mb-6 px-5 py-2 
          bg-gradient-to-r from-purple-600 to-pink-500 
          text-white rounded-full 
          shadow-md hover:shadow-xl 
          transition-all duration-300
        "
      >
        Crear Usuario
      </button>

      {loading && <p className="text-purple-700 mb-4">Cargando usuarios...</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Contenedor scroll mobile */}
      <div className="overflow-x-auto rounded-2xl border border-white/30 bg-white/10 backdrop-blur-lg">
        <table className="min-w-full text-left text-gray-900">
          <thead>
            <tr className="bg-white/20 backdrop-blur-xl text-purple-900 font-semibold">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr 
                key={u.id} 
                className="border-b border-purple-200/30 hover:bg-white/30 transition"
              >
                <td className="px-4 py-3">{u.id}</td>
                <td className="px-4 py-3">{u.nombre}</td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">{u.rol}</td>
                <td className="px-4 py-3 flex gap-2 justify-center">
                  <button
                    onClick={() => handleEdit(u)}
                    className="
                      px-3 py-1 rounded-full 
                      bg-yellow-500 text-white 
                      hover:bg-yellow-400 
                      transition-all shadow
                    "
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    className="
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
        title={editUsuario ? "Editar Usuario" : "Crear Usuario"}
      >
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Nombre"
            className="px-3 py-2 rounded bg-white/30 backdrop-blur-lg border border-white/40"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="px-3 py-2 rounded bg-white/30 backdrop-blur-lg border border-white/40"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <select
            className="px-3 py-2 rounded bg-white/30 backdrop-blur-lg border border-white/40"
            value={rol}
            onChange={e => setRol(e.target.value as "ADMIN" | "USER")}
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>

          <button
            onClick={handleSave}
            className="
              px-4 py-2 
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

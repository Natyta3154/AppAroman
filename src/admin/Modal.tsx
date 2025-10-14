// src/admin/Modal.tsx
import type{ ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md">
        {title && <h2 className="text-xl font-bold mb-4 text-white">{title}</h2>}
        {children}
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-400"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

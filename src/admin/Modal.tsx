// src/admin/Modal.tsx
import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg p-6 w-full max-w-md max-h-[90vh] flex flex-col">
        {title && <h2 className="text-xl font-bold mb-4 text-white shrink-0">{title}</h2>}
        <div className="overflow-y-auto flex-1 pr-2 pb-2">
          {children}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-white/20 transition-all duration-300 shrink-0 cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>,
    document.body
  );
}

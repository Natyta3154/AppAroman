// src/hooks/useForgotPassword.ts
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;


interface ForgotPasswordResult {
    message: string;
    error: string;
    loading: boolean;
    forgotPassword: (email: string) => Promise<void>;
}

export const useForgotPassword = (): ForgotPasswordResult => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const forgotPassword = async (email: string) => {
        setLoading(true);
        setMessage('');
        setError('');

        try {
            const response = await fetch(`${API_BASE}/usuarios/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            // Usamos el mensaje genérico por seguridad, incluso si falla el backend (status 400/404)
            // para evitar la enumeración de emails.
            if (response.ok || response.status === 404 || response.status === 400) {
                setMessage(
                    'Si el correo electrónico está registrado, recibirás un enlace de restablecimiento. Revisa tu bandeja de entrada.'
                );
            } else {
                const data = await response.json();
                setError(data.error || 'Error al procesar la solicitud.');
            }
        } catch (err) {
            console.error('Network Error:', err);
            setError('No se pudo conectar con el servidor. Verifica tu conexión.');
        } finally {
            setLoading(false);
        }
    };

    return { message, error, loading, forgotPassword };
};
// src/hooks/useResetPassword.ts
import { useState } from 'react';

const API_BASE = import.meta.env.VITE_API_URL;

interface ResetPasswordResult {
    message: string;
    error: string;
    loading: boolean;
    resetPassword: (email: string, token: string, newPassword: string) => Promise<boolean>;
}

export const useResetPassword = (): ResetPasswordResult => {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const resetPassword = async (email: string, token: string, newPassword: string): Promise<boolean> => {
        setLoading(true);
        setMessage('');
        setError('');

        if (!token || !email) {
             setError('Error: Enlace de restablecimiento incompleto.');
             setLoading(false);
             return false;
        }

        try {
            const url = `${API_BASE}/usuarios/reset-password?token=${token}&email=${email}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Contraseña restablecida con éxito.');
                return true; // Éxito
            } else {
                // Captura errores del backend (ej: token inválido o expirado)
                setError(data.error || 'El enlace es inválido o ha expirado. Por favor, solicita uno nuevo.');
                return false; // Fallo
            }
        } catch (err) {
            console.error('Network Error:', err);
            setError('No se pudo conectar con el servidor.');
            return false; // Fallo
        } finally {
            setLoading(false);
        }
    };

    return { message, error, loading, resetPassword };
};
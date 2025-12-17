// src/pages/auth/ResetPasswordPage.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useResetPassword } from '../hooks/useResetPassword';

const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    
    // Extraer token y email de la URL
    const token = query.get('token');
    const email = query.get('email');
    
    const { message, error, loading, resetPassword } = useResetPassword();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    // Valida que los parámetros esenciales de la URL existan
    useEffect(() => {
        if (message && !error) {
            // Si hay mensaje de éxito, redirigir después de 3 segundos
            setTimeout(() => navigate('/login'), 3000);
            setIsComplete(true);
        }
    }, [message, error, navigate]);


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!token || !email) {
            return; // Ya el hook o el componente manejan el error de link incompleto
        }

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden.');
            return;
        }

        const success = await resetPassword(email, token, newPassword);
        
        if (success) {
            // El useEffect se encargará de la redirección
            console.log('Restablecimiento exitoso.');
        } else {
            console.log('Fallo el restablecimiento.');
        }
    };
    
    if (!token || !email) {
        return (
            <div className="auth-form-container">
                <h2>Enlace Inválido</h2>
                <p className="error-message">El enlace para restablecer la contraseña es incompleto o incorrecto.</p>
                <Link to="/forgot-password">Solicitar un nuevo enlace</Link>
            </div>
        );
    }

    if (isComplete) {
         return (
            <div className="auth-form-container">
                <h2>¡Completado!</h2>
                <p className="success-message">{message}</p>
                <p>Serás redirigido al login en breve...</p>
            </div>
        );
    }


    return (
        <div className="auth-form-container">
            <h2>Establecer Nueva Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nueva Contraseña (mínimo 6 caracteres)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Confirmar Nueva Contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}
            
            <p className="link-text">
                <Link to="/forgot-password">Solicitar un nuevo enlace</Link>
            </p>
        </div>
    );
};

export default ResetPasswordPage;
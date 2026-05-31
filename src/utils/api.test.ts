import { describe, it, expect, vi, beforeEach } from 'vitest';
import api from './api';

describe('API Axios Instance', () => {
  beforeEach(() => {
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    // Limpiar mocks
    vi.clearAllMocks();
  });

  it('debe tener la baseURL correcta configurada', () => {
    const expectedBaseUrl = import.meta.env.VITE_API_URL || "https://apisahumerios-i8pd.onrender.com";
    expect(api.defaults.baseURL).toBe(expectedBaseUrl);
  });

  it('debe enviar el header Content-Type como application/json', () => {
    expect(api.defaults.headers['Content-Type']).toBe('application/json');
  });
});

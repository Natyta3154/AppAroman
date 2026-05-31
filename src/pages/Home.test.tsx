import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from './Home';
import { describe, it, expect, vi } from 'vitest';

// Mockear el hook useProductosDestacado para evitar llamadas reales a la API
vi.mock('../hooks/useProductosDestacado', () => ({
  useDestacados: () => ({
    destacados: [
      {
        id: 1,
        nombre: 'Sahumerio Test',
        descripcion: 'Olor muy rico',
        precio: 1500,
        imagenUrl: 'https://via.placeholder.com/150',
      }
    ],
    loading: false,
    error: null,
  })
}));

vi.mock('../hooks/useOfertas', () => ({
  useOfertas: () => ({
    ofertas: [],
    cargando: false,
    error: null,
  })
}));

vi.mock('../hooks/usePosts', () => ({
  usePosts: () => ({
    posts: [],
    loading: false,
    error: null,
  })
}));

describe('Home Component', () => {
  it('renderiza la sección principal y el Hero', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    
    // Verificar que el título principal de la tienda exista
    expect(screen.getByText(/Conectá con la esencia de tu alma/i)).toBeInTheDocument();
  });

  it('renderiza la sección de Productos Destacados con el mock', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );

    // Verificar que el producto mockeado se renderiza
    expect(screen.getByText('Sahumerio Test')).toBeInTheDocument();
    expect(screen.getByText('$1500')).toBeInTheDocument();
  });
});

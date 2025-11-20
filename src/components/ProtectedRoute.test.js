// src/components/ProtectedRoute.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Mock do localStorage
const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');

beforeEach(() => {
  jest.clearAllMocks();
});

// Componentes auxiliares
const PaginaProtegida = () => <div data-testid="pagina-protegida">Página Secreta</div>;
const PaginaLogin = () => <div>Página de Login</div>;

describe('ProtectedRoute', () => {
  
  it('redireciona para /login quando não há token', () => {
    mockGetItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PaginaProtegida />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByTestId('pagina-protegida')).not.toBeInTheDocument();
  });

  it('renderiza o conteúdo quando há token', () => {
    mockGetItem.mockReturnValue('jwt-token');

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PaginaProtegida />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
    expect(mockGetItem).toHaveBeenCalled();
  });

  it('envia state { unauthorized: true } ao redirecionar', () => {
    mockGetItem.mockReturnValue(null);

    const PaginaLoginComEstado = () => {
      const { state } = useLocation();
      return (
        <div>
          Unauthorized: {String(state?.unauthorized)}
        </div>
      );
    };

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<PaginaLoginComEstado />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PaginaProtegida />
              </ProtectedRoute>
            }
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText(/Unauthorized: true/i)).toBeInTheDocument();
  });

});

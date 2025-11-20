import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PublicRoute from './PublicRoute';

describe('PublicRoute', () => {

  test('deve renderizar o conteúdo público quando não houver token', () => {
    localStorage.removeItem('token');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <div>Conteúdo Público</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Conteúdo Público')).toBeInTheDocument();
  });

  test('deve redirecionar para /dashboard quando houver token', async () => {
    localStorage.setItem('token', 'abc123');

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route
            path="/"
            element={
              <PublicRoute>
                <div>Conteúdo Público</div>
              </PublicRoute>
            }
          />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // A navegação acontece automaticamente
    expect(screen.getByText('Dashboard Page')).toBeInTheDocument();

    // Conteúdo público não deve aparecer mais
    expect(screen.queryByText('Conteúdo Público')).not.toBeInTheDocument();
  });
});

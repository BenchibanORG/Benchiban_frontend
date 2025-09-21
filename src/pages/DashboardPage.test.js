import React from 'react';
import { render, screen } from '@testing-library/react';
import DashboardPage from './DashboardPage';

describe('DashboardPage', () => {
  it('deve renderizar o cabeçalho e os três cards de GPU', () => {
    // Act: Renderiza a página do dashboard
    render(<DashboardPage />);

    // Assert: Verifica se os textos do cabeçalho estão na tela
    expect(screen.getByRole('heading', { name: /Benchiban/i })).toBeInTheDocument();
    expect(screen.getByText(/O melhor preço de GPU em primeiro lugar!/i)).toBeInTheDocument();

    // Assert: Verifica se os nomes das três GPUs (dos dados mockados) são renderizados
    expect(screen.getByText('NVIDIA RTX 4090')).toBeInTheDocument();
    expect(screen.getByText('AMD RX 7900 XTX')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA RTX 4080')).toBeInTheDocument();
  });
});
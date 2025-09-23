import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';

// Mock para o hook useNavigate, para podermos verificar se o redirecionamento ocorre
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa o resto da biblioteca normalmente
  useNavigate: () => mockNavigate, // Sobrescreve o useNavigate com nosso mock
}));

describe('DashboardPage', () => {

  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('deve renderizar o cabeçalho e os três cards de GPU', () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /Benchiban/i })).toBeInTheDocument();
    expect(screen.getByText(/O melhor preço de GPU em primeiro lugar!/i)).toBeInTheDocument();
    expect(screen.getByText('NVIDIA RTX 4090')).toBeInTheDocument();
    // ... (outras verificações de renderização)
  });

  it('deve navegar para a página de resultados ao clicar em um card de GPU', async () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
    
    // Act: Encontra o primeiro card (pelo texto do seu título) e o clica
    // O 'closest' encontra o elemento clicável mais próximo (o CardActionArea)
    const firstCard = screen.getByText('NVIDIA RTX 4090').closest('button');
    await userEvent.click(firstCard);
    
    // Assert: Verifica se a função de navegação foi chamada para a rota correta
    expect(mockNavigate).toHaveBeenCalledWith('/results');
  });
});
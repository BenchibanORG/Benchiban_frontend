import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AppHeader from './AppHeader';

// 1. Setup dos Mocks do React Router
const mockNavigate = jest.fn();
let mockPathname = '/dashboard'; // Valor padrão inicial

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: mockPathname }),
}));

// 2. Setup do Mock do LocalStorage
const mockRemoveItem = jest.fn();
Object.defineProperty(window, 'localStorage', {
  value: {
    removeItem: mockRemoveItem,
  },
  writable: true,
});

describe('AppHeader Component', () => {
  
  // Limpa os mocks antes de cada teste para evitar contaminação
  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname = '/dashboard'; // Reseta a rota para o padrão
  });

  it('deve renderizar o logo corretamente e navegar para dashboard ao clicar', () => {
    render(<AppHeader />);

    const logo = screen.getByAltText('Benchiban Logo');
    expect(logo).toBeInTheDocument();

    // Simula clique no logo
    fireEvent.click(logo);

    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

  it('deve realizar o logout corretamente (limpar storage e navegar para login)', () => {
    render(<AppHeader />);

    const logoutButton = screen.getByRole('button', { name: /Sair/i });
    expect(logoutButton).toBeInTheDocument();

    // Simula clique em Sair
    fireEvent.click(logoutButton);

    // Verifica se removeu os tokens
    expect(mockRemoveItem).toHaveBeenCalledWith('token');
    expect(mockRemoveItem).toHaveBeenCalledWith('authToken');

    // Verifica redirecionamento
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  // --- Testes da Lógica Condicional do Botão (Histórico vs Voltar) ---

  it('deve exibir o botão "Histórico" quando NÃO estiver na página de histórico', () => {
    mockPathname = '/dashboard'; // Configura rota diferente de /history
    render(<AppHeader />);

    // Verifica se o botão Histórico existe
    const historyButton = screen.getByRole('button', { name: /Histórico/i });
    expect(historyButton).toBeInTheDocument();

    // Verifica se o botão Voltar NÃO existe
    const backButton = screen.queryByRole('button', { name: /Voltar/i });
    expect(backButton).not.toBeInTheDocument();

    // Testa a navegação
    fireEvent.click(historyButton);
    expect(mockNavigate).toHaveBeenCalledWith('/history');
  });

  it('deve exibir o botão "Voltar" quando ESTIVER na página exata /history', () => {
    mockPathname = '/history'; // Configura rota para /history
    render(<AppHeader />);

    // Verifica se o botão Voltar existe
    const backButton = screen.getByRole('button', { name: /Voltar/i });
    expect(backButton).toBeInTheDocument();

    // Verifica se o botão Histórico NÃO existe
    const historyButton = screen.queryByRole('button', { name: /Histórico/i });
    expect(historyButton).not.toBeInTheDocument();

    // Testa a navegação (deve voltar -1)
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('deve exibir o botão "Voltar" quando estiver em uma sub-rota de histórico', () => {
    mockPathname = '/history/details/123'; // Simula sub-rota
    render(<AppHeader />);

    const backButton = screen.getByRole('button', { name: /Voltar/i });
    expect(backButton).toBeInTheDocument();
    
    // Garante que a lógica .includes('/history') está funcionando
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
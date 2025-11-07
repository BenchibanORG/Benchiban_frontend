import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import AppLayout from './AppLayout';

// --- MOCKS ---

// Mock do hook useNavigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Importa e mantém as outras funcionalidades
  useNavigate: () => mockNavigate, // Sobrescreve apenas o useNavigate
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => { // Esta é a função que precisamos de testar
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Aplica o mock ao objeto 'window'
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
});

// Limpa os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear();
});

// Função auxiliar para renderizar o componente dentro de um Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

// --- TESTES ---

describe('Componente AppLayout', () => {

  it('deve renderizar o header (logo, título, botão Sair) e os children por padrão', () => {
    renderWithRouter(
      <AppLayout>
        <div>Conteúdo da Página</div>
      </AppLayout>
    );

    // Verifica os elementos do Header
    expect(screen.getByAltText('Benchiban Logo')).toBeInTheDocument();
    expect(screen.getByText('BENCHIBAN')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sair/i })).toBeInTheDocument();

    // Verifica se o conteúdo (children) foi renderizado
    expect(screen.getByText('Conteúdo da Página')).toBeInTheDocument();
  });

  it('não deve renderizar o header se a prop showHeader for false', () => {
    renderWithRouter(
      <AppLayout showHeader={false}>
        <div>Conteúdo da Página</div>
      </AppLayout>
    );

    // Verifica que os elementos do Header NÃO estão presentes
    expect(screen.queryByAltText('Benchiban Logo')).not.toBeInTheDocument();
    expect(screen.queryByText('BENCHIBAN')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Sair/i })).not.toBeInTheDocument();

    // Verifica que o conteúdo (children) AINDA está presente
    expect(screen.getByText('Conteúdo da Página')).toBeInTheDocument();
  });

  it('deve aplicar a prop maxWidth corretamente ao Container', () => {
    renderWithRouter(
      <AppLayout maxWidth="md">
        <div>Conteúdo Teste</div>
      </AppLayout>
    );
    
    // O Container do MUI é o elemento pai do 'children'
    const containerElement = screen.getByText('Conteúdo Teste').parentElement;
    expect(containerElement).toHaveClass('MuiContainer-maxWidthMd');
  });

  it('deve chamar removeItem do localStorage e navegar para /login ao clicar em "Sair"', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppLayout><div>Conteúdo</div></AppLayout>);

    const logoutButton = screen.getByRole('button', { name: /Sair/i });
    await user.click(logoutButton);

    // Verifica se o localStorage.removeItem foi chamado corretamente
    expect(localStorageMock.removeItem).toHaveBeenCalledTimes(1);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');

    // Verifica se a navegação ocorreu
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

  it('deve navegar para /dashboard ao clicar no logo', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppLayout><div>Conteúdo</div></AppLayout>);

    const logoImage = screen.getByAltText('Benchiban Logo');
    await user.click(logoImage);

    // Verifica a navegação
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
  
  it('deve navegar para /dashboard ao clicar no título', async () => {
    const user = userEvent.setup();
    renderWithRouter(<AppLayout><div>Conteúdo</div></AppLayout>);

    const titleText = screen.getByText('BENCHIBAN');
    await user.click(titleText);

    // Verifica a navegação
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });

});
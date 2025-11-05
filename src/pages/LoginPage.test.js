import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as api from '../services/api';

// --- MOCKS ---
jest.mock('../services/api');
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock do localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// --- CONFIGURAÇÃO DE TIMERS ---
// Informa ao Jest que usaremos timers falsos para controlar o 'setTimeout'
jest.useFakeTimers();

describe('Página de Login', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  it('deve renderizar todos os elementos corretamente', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // --- CORREÇÃO 1: RESOLVENDO O ERRO DE MÚLTIPLOS ELEMENTOS ---
    // Usamos 'getAllByRole' para encontrar todos os cabeçalhos "Benchiban"
    // e verificamos se o primeiro (o mais externo) existe.
    const headings = screen.getAllByRole('heading', { name: /Benchiban/i });
    expect(headings[0]).toBeInTheDocument();

    // Verifica os outros elementos
    expect(screen.getByLabelText(/Endereço de E-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByText(/Esqueceu a senha\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Ainda não tem conta\? Crie uma!/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/Lembre de mim/i)).not.toBeInTheDocument();
  });

  it('deve permitir ao usuário digitar email e senha', async () => {
    // --- CORREÇÃO 2: LIGANDO O userEvent AOS FAKE TIMERS ---
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/Endereço de E-mail/i);
    const passwordInput = screen.getByLabelText(/Senha/i);

    await user.type(emailInput, 'teste@exemplo.com');
    await user.type(passwordInput, 'senha123');

    expect(emailInput).toHaveValue('teste@exemplo.com');
    expect(passwordInput).toHaveValue('senha123');
  });

  it('deve fazer login com sucesso, salvar o token e redirecionar para /dashboard', async () => {
    // --- CORREÇÃO 2: LIGANDO O userEvent AOS FAKE TIMERS ---
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockTokenData = { access_token: 'fake-jwt-token-123', token_type: 'bearer' };
    api.loginUser.mockResolvedValue(mockTokenData); 

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/Endereço de E-mail/i), 'teste@exemplo.com');
    await user.type(screen.getByLabelText(/Senha/i), 'senha123');

    const loginButton = screen.getByRole('button', { name: /Login/i });
    await user.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith('teste@exemplo.com', 'senha123');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token-123');
    expect(await screen.findByText('Login bem-sucedido! A redirecionar...')).toBeInTheDocument();
    
    // Avança os timers do Jest para executar o 'setTimeout'
    jest.advanceTimersByTime(2000);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir mensagem de erro quando o login falhar', async () => {
    // --- CORREÇÃO 2: LIGANDO O userEvent AOS FAKE TIMERS ---
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const errorMessage = 'Credenciais inválidas';
    api.loginUser.mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await user.type(screen.getByLabelText(/Endereço de E-mail/i), 'errado@exemplo.com');
    await user.type(screen.getByLabelText(/Senha/i), 'senhaerrada');
    
    const loginButton = screen.getByRole('button', { name: /Login/i });
    await user.click(loginButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('deve exibir erro se os campos estiverem vazios', async () => {
    // --- CORREÇÃO 2: LIGANDO O userEvent AOS FAKE TIMERS ---
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button', { name: /Login/i }));

    expect(await screen.findByText('Por favor, preencha o e-mail e a senha.')).toBeInTheDocument();
    expect(api.loginUser).not.toHaveBeenCalled();
  });
});
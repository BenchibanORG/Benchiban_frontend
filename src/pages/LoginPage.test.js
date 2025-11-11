import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as api from '../services/api';
import { fireEvent } from '@testing-library/react';

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

jest.useFakeTimers();

describe('Página de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  const renderPage = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar todos os elementos principais', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /Bem-vindo\!/i })).toBeInTheDocument();
    expect(screen.getByText(/Entre para acessar sua conta/i)).toBeInTheDocument();

    // Campos principais localizados por placeholder
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
    expect(screen.getByText(/Esqueceu a senha\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Ainda não tem conta\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Crie uma agora/i)).toBeInTheDocument();
  });

  it('deve permitir ao usuário digitar email e senha', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'teste@exemplo.com');
    await user.type(passwordInput, 'senha123');

    expect(emailInput).toHaveValue('teste@exemplo.com');
    expect(passwordInput).toHaveValue('senha123');
  });

  it('deve alternar a visibilidade da senha ao clicar no ícone', () => {
  renderPage();

  const passwordInput = screen.getByPlaceholderText('••••••••');
  const toggleButton = screen.getByLabelText(/toggle password visibility/i);

  // Inicialmente deve estar no modo "password"
  expect(passwordInput).toHaveAttribute('type', 'password');

  fireEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute('type', 'text');

  fireEvent.click(toggleButton);
  expect(passwordInput).toHaveAttribute('type', 'password');
});

  it('deve exibir erro se os campos estiverem vazios', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderPage();

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    expect(await screen.findByText(/por favor, preencha o e-mail e a senha/i)).toBeInTheDocument();
    expect(api.loginUser).not.toHaveBeenCalled();
  });

  it('deve fazer login com sucesso, salvar token e redirecionar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const mockTokenData = { access_token: 'fake-jwt-token-123', token_type: 'bearer' };
    api.loginUser.mockResolvedValue(mockTokenData);

    renderPage();

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'teste@exemplo.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'senha123');

    const loginButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(loginButton);

    expect(loginButton).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith('teste@exemplo.com', 'senha123');
    });

    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token-123');
    expect(await screen.findByText(/login bem-sucedido! a redirecionar/i)).toBeInTheDocument();

    jest.advanceTimersByTime(2000);
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir mensagem de erro quando o login falhar', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const errorMessage = 'Credenciais inválidas';
    api.loginUser.mockRejectedValue(new Error(errorMessage));

    renderPage();

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'errado@exemplo.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'senhaerrada');

    const loginButton = screen.getByRole('button', { name: /entrar/i });
    await user.click(loginButton);

    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

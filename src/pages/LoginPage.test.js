/**
 * @jest-environment jsdom
 */

import React from 'react';
import {
  render,
  screen,
  waitFor,
  fireEvent
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as api from '../services/api';
import { act } from 'react-dom/test-utils';

// --- MOCKS ---
jest.mock('../services/api');

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

// Mock do navigate
const mockNavigate = jest.fn();

// Variável para simular rotas protegidas
let mockLocationState = {};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
  useLocation: () => ({
    state: mockLocationState,
  }),
}));

jest.useFakeTimers();

describe('Página de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.clear();

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // reseta o estado da rota
    mockLocationState = {};
  });

  const renderPage = () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  //  TESTES
  it('deve renderizar todos os elementos principais', () => {
    renderPage();

    expect(screen.getByRole('heading', { name: /Bem-vindo\!/i })).toBeInTheDocument();
    expect(screen.getByText(/Entre para acessar sua conta/i)).toBeInTheDocument();

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

    expect(api.loginUser).toHaveBeenCalledWith('teste@exemplo.com', 'senha123');
    expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token-123');

    expect(await screen.findByText(/login bem-sucedido! a redirecionar/i)).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard', { replace: true });
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

  //  TESTES DE WARNING DA ROTA PROTEGIDA
  it('deve exibir o aviso de rota protegida quando unauthorized for true', () => {
    mockLocationState = { unauthorized: true };

    renderPage();

    expect(
      screen.getByText('Você precisa estar logado para acessar esta página.')
    ).toBeInTheDocument();
  });

  it('deve redirecionar para a página anterior após login bem-sucedido se houver location.state.from', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    mockLocationState = {
      unauthorized: true,
      from: { pathname: '/results' }
    };

    api.loginUser.mockResolvedValue({ access_token: 'abc123' });

    renderPage();

    await user.type(screen.getByPlaceholderText('seu@email.com'), 'aaa@bbb.com');
    await user.type(screen.getByPlaceholderText('••••••••'), 'senha123');

    await user.click(screen.getByRole('button', { name: /entrar/i }));

    await act(async () => {
      jest.advanceTimersByTime(2000);
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/results', { replace: true });
    });
  });

  it('warning não deve atrapalhar o uso normal da tela', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    mockLocationState = { unauthorized: true };

    renderPage();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('••••••••');

    await user.type(emailInput, 'x@y.com');
    await user.type(passwordInput, 'senha123');

    expect(emailInput).toHaveValue('x@y.com');
    expect(passwordInput).toHaveValue('senha123');
  });
});
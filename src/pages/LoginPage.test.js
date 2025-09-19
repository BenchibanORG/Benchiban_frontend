import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import * as api from '../services/api';

// Mock para a função loginUser da nossa API
jest.mock('../services/api');

// Mock do useNavigate
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
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

// Mock do alert
global.alert = jest.fn();

describe('Página de Login', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Configura o mock do localStorage
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  it('deve renderizar todos os elementos corretamente', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/lembre de mim/i)).toBeInTheDocument();
    expect(screen.getByText(/esqueceu a senha\?/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/ainda não tem conta\? crie uma!/i)).toBeInTheDocument();
  });

  it('deve permitir ao usuário digitar email e senha', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    const passwordInput = screen.getByLabelText(/senha/i);

    fireEvent.change(emailInput, { target: { value: 'teste@exemplo.com' } });
    fireEvent.change(passwordInput, { target: { value: 'senha123' } });

    expect(emailInput.value).toBe('teste@exemplo.com');
    expect(passwordInput.value).toBe('senha123');
  });

  it('deve fazer login com sucesso e redirecionar para o dashboard', async () => {
    const mockTokenData = { access_token: 'fake-jwt-token-123', token_type: 'bearer' };
    api.loginUser.mockResolvedValue(mockTokenData);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { 
      target: { value: 'teste@exemplo.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'senha123' } 
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(api.loginUser).toHaveBeenCalledWith('teste@exemplo.com', 'senha123');
      expect(localStorageMock.setItem).toHaveBeenCalledWith('authToken', 'fake-jwt-token-123');
      expect(global.alert).toHaveBeenCalledWith('Login bem-sucedido!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('deve exibir mensagem de erro quando o login falhar', async () => {
    const errorMessage = 'Credenciais inválidas';
    api.loginUser.mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { 
      target: { value: 'errado@exemplo.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'senhaerrada' } 
    });

    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(global.alert).not.toHaveBeenCalled();
  });

  it('deve limpar mensagens de erro ao tentar login novamente', async () => {
    const errorMessage = 'Credenciais inválidas';
    api.loginUser
      .mockRejectedValueOnce(new Error(errorMessage))
      .mockResolvedValueOnce({ access_token: 'new-token', token_type: 'bearer' });

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Primeira tentativa falha
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { 
      target: { value: 'errado@exemplo.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'senhaerrada' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    // Segunda tentativa bem-sucedida - limpa os campos primeiro
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { 
      target: { value: 'correto@exemplo.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'senhacorreta' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // A mensagem de erro deve sumir
    await waitFor(() => {
      expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
    });
  });

  it('deve navegar para a página de registro ao clicar no link', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    const registerLink = screen.getByText(/ainda não tem conta\? crie uma!/i);
    expect(registerLink.closest('a')).toHaveAttribute('href', '/register');
  });

  it('deve validar campos obrigatórios - não deve chamar API com campos vazios', async () => {
    // Mock para capturar se a API foi chamada
    const loginUserMock = jest.fn();
    api.loginUser.mockImplementation(loginUserMock);

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    // Clica no botão sem preencher os campos
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Aguarda um ciclo para garantir que o handler foi processado
    await new Promise(resolve => setTimeout(resolve, 0));

    // A API não deve ser chamada porque os campos estão vazios
    expect(loginUserMock).not.toHaveBeenCalled();
  });

  it('deve exibir mensagem de erro da API quando o login falhar', async () => {
    const errorMessage = 'Credenciais inválidas';
    api.loginUser.mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { 
      target: { value: 'errado@exemplo.com' } 
    });
    fireEvent.change(screen.getByLabelText(/senha/i), { 
      target: { value: 'senhaerrada' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
    
    expect(localStorageMock.setItem).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
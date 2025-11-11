// src/pages/RegisterPage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import * as api from '../services/api';

// Mock do módulo de API
jest.mock('../services/api');

// Mock do useNavigate (se necessário em futuros asserts)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const original = jest.requireActual('react-router-dom');
  return {
    ...original,
    useNavigate: () => mockNavigate,
  };
});

describe('RegisterPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );

  it('deve cadastrar um usuário com sucesso ao submeter o formulário', async () => {
    // arrange
    api.registerUser.mockResolvedValue({ id: 1, email: 'teste@teste.com' });

    const user = userEvent.setup();
    renderComponent();

    // obtém os inputs: email por placeholder e os dois campos de senha pelo placeholder compartilhado
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordPlaceholders = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = passwordPlaceholders[0];
    const confirmPasswordInput = passwordPlaceholders[1];

    // act
    await user.type(emailInput, 'teste@teste.com');
    await user.type(passwordInput, 'senha123');
    await user.type(confirmPasswordInput, 'senha123');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    // assert: a API foi chamada com os argumentos corretos
    await waitFor(() => {
      expect(api.registerUser).toHaveBeenCalledTimes(1);
      expect(api.registerUser).toHaveBeenCalledWith('teste@teste.com', 'senha123');
    });

    // verifica mensagem de sucesso exibida
    expect(await screen.findByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
  });

  it('deve mostrar erro quando as senhas não coincidem', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');

    await user.type(emailInput, 'teste@teste.com');
    await user.type(passwordInput, 'senha123');
    await user.type(confirmPasswordInput, 'senhadiferente');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    // a validação de front-end deveria exibir erro imediatamente
    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it('deve mostrar erro quando o e-mail é inválido', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');

    await user.type(emailInput, 'email-invalido');
    await user.type(passwordInput, 'senha123');
    await user.type(confirmPasswordInput, 'senha123');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    // validação do e-mail inválido
    expect(await screen.findByText(/por favor, digite um email válido/i)).toBeInTheDocument();
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it('deve mostrar erro da API quando o cadastro falha no backend', async () => {
    // arrange: mock rejeita
    api.registerUser.mockRejectedValue(new Error('Email já cadastrado'));

    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const [passwordInput, confirmPasswordInput] = screen.getAllByPlaceholderText('••••••••');

    await user.type(emailInput, 'existente@teste.com');
    await user.type(passwordInput, 'senha123');
    await user.type(confirmPasswordInput, 'senha123');

    await user.click(screen.getByRole('button', { name: /criar conta/i }));

    // espera mensagem de erro retornada pela API aparecer
    expect(await screen.findByText(/email já cadastrado/i)).toBeInTheDocument();
  });
});

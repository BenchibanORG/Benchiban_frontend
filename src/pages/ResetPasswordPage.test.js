// src/pages/ResetPasswordPage.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import * as api from '../services/api';
import ResetPasswordPage from './ResetPasswordPage';

// --- MOCKS ---
jest.mock('../services/api');
const mockNavigate = jest.fn();
const mockUseSearchParams = jest.fn();

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => mockUseSearchParams(),
  };
});

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSearchParams.mockReturnValue([new URLSearchParams('token=fakeToken')]);
  });

  const renderComponent = () =>
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );

  it('deve renderizar os elementos principais', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /redefinir senha/i })).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar nova senha/i })).toBeInTheDocument();
  });

  it('deve exibir erro se os campos estiverem vazios', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));
    expect(await screen.findByText(/por favor, preencha todos os campos/i)).toBeInTheDocument();
    expect(api.resetPassword).not.toHaveBeenCalled();
  });

  it('deve exibir erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, 'senha12345');
    await user.type(confirm, 'senhaErrada');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
  });

  it('deve exibir erro se a senha for curta demais', async () => {
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, '123');
    await user.type(confirm, '123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    const mensagens = await screen.findAllByText(/a senha deve ter no mínimo 8 caracteres/i);
    expect(mensagens.length).toBeGreaterThan(0);
  });

  it('deve exibir erro se o token estiver ausente', async () => {
    mockUseSearchParams.mockReturnValue([new URLSearchParams('')]);
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, 'senhaValida123');
    await user.type(confirm, 'senhaValida123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText(/token de redefinição ausente ou inválido/i)).toBeInTheDocument();
  });

  it('deve redefinir senha com sucesso e exibir mensagem', async () => {
    api.resetPassword.mockResolvedValue({ message: 'Senha redefinida com sucesso!' });
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, 'senhaValida123');
    await user.type(confirm, 'senhaValida123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    await waitFor(() => {
      expect(api.resetPassword).toHaveBeenCalledWith('fakeToken', 'senhaValida123');
    });

    expect(await screen.findByText(/senha redefinida com sucesso/i)).toBeInTheDocument();
  });

  it('deve exibir erro de API com detail', async () => {
    api.resetPassword.mockRejectedValue({
      response: { data: { detail: 'Token expirado' } },
    });
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, 'senhaValida123');
    await user.type(confirm, 'senhaValida123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText(/token expirado/i)).toBeInTheDocument();
  });

  it('deve exibir erro genérico se API falhar sem detail', async () => {
    api.resetPassword.mockRejectedValue(new Error('Falha desconhecida'));
    const user = userEvent.setup();
    renderComponent();

    const password = screen.getByTestId('password-input');
    const confirm = screen.getByTestId('confirm-password-input');

    await user.type(password, 'senhaValida123');
    await user.type(confirm, 'senhaValida123');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText(/ocorreu um erro ao redefinir a senha/i)).toBeInTheDocument();
  });

  it('deve alternar visibilidade de senha e confirmação', async () => {
    const user = userEvent.setup();
    renderComponent();

    const passwordInput = screen.getByTestId('password-input');
    const confirmInput = screen.getByTestId('confirm-password-input');
    const buttons = screen.getAllByRole('button');

    // Filtra ícones de visibilidade
    const toggleIcons = buttons.filter((btn) => btn.querySelector('svg'));

    await user.click(toggleIcons[0]);
    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleIcons[1]);
    expect(confirmInput).toHaveAttribute('type', 'text');
  });

  it('deve navegar para login ao clicar em "Voltar para o login"', async () => {
    const user = userEvent.setup();
    renderComponent();

    await user.click(screen.getByRole('button', { name: /voltar para o login/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import { resetPassword } from '../services/api';

jest.mock('../services/api');

describe('Componente ResetPasswordPage', () => {
  const renderComponent = (url = '/reset-password?token=abc123') => {
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('deve permitir mostrar e esconder as senhas', () => {
    renderComponent();

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botoesVisibilidade = screen.getAllByLabelText(/toggle password visibility/i);

    expect(novaSenhaInput).toHaveAttribute('type', 'password');
    expect(confirmarSenhaInput).toHaveAttribute('type', 'password');

    fireEvent.click(botoesVisibilidade[0]);
    fireEvent.click(botoesVisibilidade[1]);

    expect(novaSenhaInput).toHaveAttribute('type', 'text');
    expect(confirmarSenhaInput).toHaveAttribute('type', 'text');

    fireEvent.click(botoesVisibilidade[0]);
    fireEvent.click(botoesVisibilidade[1]);

    expect(novaSenhaInput).toHaveAttribute('type', 'password');
    expect(confirmarSenhaInput).toHaveAttribute('type', 'password');
  });

  test('deve chamar a API, exibir sucesso e redirecionar após 3s', async () => {
    resetPassword.mockResolvedValueOnce({ message: 'Senha redefinida com sucesso!' });
    jest.useFakeTimers();

    renderComponent();

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });

    fireEvent.change(novaSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.change(confirmarSenhaInput, { target: { value: 'NovaSenha123!' } });
    fireEvent.click(botaoSalvar);

    await waitFor(() =>
      expect(resetPassword).toHaveBeenCalledWith('abc123', 'NovaSenha123!')
    );

    expect(await screen.findByText(/senha redefinida com sucesso/i)).toBeInTheDocument();

    jest.advanceTimersByTime(3000);
  });

  // 🧪 Novo: campos vazios
  test('deve exibir erro ao enviar com campos vazios', async () => {
    renderComponent();

    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });
    fireEvent.click(botaoSalvar);

    expect(await screen.findByText(/por favor, preencha todos os campos/i)).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  // 🧪 Novo: senhas diferentes
  test('deve exibir erro quando as senhas não coincidem', async () => {
    renderComponent();

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });

    fireEvent.change(novaSenhaInput, { target: { value: 'Senha123' } });
    fireEvent.change(confirmarSenhaInput, { target: { value: 'Senha456' } });
    fireEvent.click(botaoSalvar);

    expect(await screen.findByText(/as senhas não coincidem/i)).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  // 🧪 Novo: senha curta
  test('deve exibir erro quando a senha tiver menos de 8 caracteres', async () => {
    renderComponent();

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });

    fireEvent.change(novaSenhaInput, { target: { value: '12345' } });
    fireEvent.change(confirmarSenhaInput, { target: { value: '12345' } });
    fireEvent.click(botaoSalvar);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/mínimo 8 caracteres/i);
  });

  // 🧪 Novo: token ausente
  test('deve exibir erro quando o token estiver ausente', async () => {
    renderComponent('/reset-password'); // sem token

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });

    fireEvent.change(novaSenhaInput, { target: { value: 'SenhaValida123' } });
    fireEvent.change(confirmarSenhaInput, { target: { value: 'SenhaValida123' } });
    fireEvent.click(botaoSalvar);

    expect(
      await screen.findByText(/token de redefinição ausente ou inválido/i)
    ).toBeInTheDocument();
    expect(resetPassword).not.toHaveBeenCalled();
  });

  // 🧪 Novo: erro de API
  test('deve exibir erro se a API retornar erro', async () => {
    resetPassword.mockRejectedValueOnce({
      response: { data: { detail: 'Token expirado' } },
    });

    renderComponent();

    const novaSenhaInput = screen.getByTestId('password-input');
    const confirmarSenhaInput = screen.getByTestId('confirm-password-input');
    const botaoSalvar = screen.getByRole('button', { name: /salvar nova senha/i });

    fireEvent.change(novaSenhaInput, { target: { value: 'SenhaValida123' } });
    fireEvent.change(confirmarSenhaInput, { target: { value: 'SenhaValida123' } });
    fireEvent.click(botaoSalvar);

    const errorAlert = await screen.findByText(/token expirado/i);
    expect(errorAlert).toBeInTheDocument();
  });
});

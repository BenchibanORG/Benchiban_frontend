import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';
import { resetPassword } from '../services/api';
jest.mock('../services/api');

describe('Página de Redefinir Senha', () => {

  // Função auxiliar para renderizar o componente com uma rota e URL específicas
  const renderWithRouter = (initialRoute) => {
    render(
      <MemoryRouter initialEntries={[initialRoute]}>
        <Routes>
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('deve renderizar todos os elementos do formulário corretamente', () => {
    renderWithRouter('/reset-password?token=some-token');

    expect(screen.getByText(/REDEFINIR SENHA/i)).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /salvar nova senha/i })).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    renderWithRouter('/reset-password?token=some-token');

    await user.type(screen.getByTestId('password-input'), 'senha123');
    await user.type(screen.getByTestId('confirm-password-input'), 'senha456');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText('As senhas não coincidem!')).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se o token estiver ausente na URL', async () => {
    const user = userEvent.setup();
    renderWithRouter('/reset-password');

    await user.type(screen.getByTestId('password-input'), 'novaSenhaSegura');
    await user.type(screen.getByTestId('confirm-password-input'), 'novaSenhaSegura');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    expect(await screen.findByText(/Token de redefinição ausente ou inválido/i)).toBeInTheDocument();
  });

  it('deve chamar a API e exibir mensagem de sucesso ao submeter senhas válidas', async () => {
    const user = userEvent.setup();
    resetPassword.mockResolvedValue({ message: 'Sua senha foi redefinida com sucesso!' });
    
    renderWithRouter('/reset-password?token=valid-token-123');

    await user.type(screen.getByTestId('password-input'), 'novaSenhaSegura');
    await user.type(screen.getByTestId('confirm-password-input'), 'novaSenhaSegura');
    
    const submitButton = screen.getByRole('button', { name: /salvar nova senha/i });
    await user.click(submitButton);

    // Verifica se a função da API foi chamada corretamente
    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledTimes(1);
      expect(resetPassword).toHaveBeenCalledWith('valid-token-123', 'novaSenhaSegura');
    });

    // Verifica se a mensagem de sucesso da API é exibida
    expect(await screen.findByText(/Sua senha foi redefinida com sucesso!/i)).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se a API falhar', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Token inválido ou expirado';
    resetPassword.mockRejectedValue({ response: { data: { detail: errorMessage } } });

    renderWithRouter('/reset-password?token=invalid-token');

    await user.type(screen.getByTestId('password-input'), 'qualquercoisa');
    await user.type(screen.getByTestId('confirm-password-input'), 'qualquercoisa');
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));
    
    // Verificamos se a mensagem de erro vinda da API é exibida
    expect(await screen.findByText(errorMessage)).toBeInTheDocument();
  });
});

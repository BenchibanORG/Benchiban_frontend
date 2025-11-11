import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';
import { forgotPassword } from '../services/api';

jest.mock('../services/api');

describe('Componente ForgotPasswordPage', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar todos os elementos principais corretamente', () => {
    renderComponent();

    // Título principal vindo do AuthPageLayout
    expect(
      screen.getByRole('heading', { name: /esqueceu a senha\?/i })
    ).toBeInTheDocument();

    // Campo de e-mail (usa placeholder)
    expect(
      screen.getByPlaceholderText('seu@email.com')
    ).toBeInTheDocument();

    // Botão principal de envio
    expect(
      screen.getByRole('button', { name: /enviar link de redefinição/i })
    ).toBeInTheDocument();

    // Link "Voltar para o Login"
    expect(
      screen.getByRole('link', { name: /voltar para o login/i })
    ).toBeInTheDocument();
  });

  it('deve exibir erro se o e-mail for inválido', async () => {
    const user = userEvent.setup();
    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });

    await user.type(emailInput, 'email-invalido');
    await user.click(submitButton);

    expect(
      await screen.findByText(/por favor, digite um endereço de e-mail válido/i)
    ).toBeInTheDocument();

    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it('deve chamar a API e exibir mensagem de sucesso ao submeter um e-mail válido', async () => {
    const user = userEvent.setup();
    const successMessage = 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.';
    forgotPassword.mockResolvedValue({ message: successMessage });

    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    await user.type(emailInput, 'teste@exemplo.com');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith('teste@exemplo.com');
    });

    expect(await screen.findByText(successMessage)).toBeInTheDocument();
    expect(emailInput).toHaveValue('');
  });

  it('deve exibir mensagem de erro genérica se a API falhar', async () => {
    const user = userEvent.setup();
    forgotPassword.mockRejectedValue(new Error('Erro de rede'));

    renderComponent();

    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });

    await user.type(emailInput, 'teste@exemplo.com');
    await user.click(submitButton);

    expect(
      await screen.findByText(/ocorreu um erro\. por favor, tente novamente mais tarde\./i)
    ).toBeInTheDocument();
  });

  it('deve conter o link de retorno para o login com a rota correta', () => {
    renderComponent();

    const backLink = screen.getByRole('link', { name: /voltar para o login/i });
    expect(backLink).toHaveAttribute('href', '/login');
  });
});

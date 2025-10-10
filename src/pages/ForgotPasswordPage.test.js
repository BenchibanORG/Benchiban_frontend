import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';
import { forgotPassword } from '../services/api';
jest.mock('../services/api');

describe('ForgotPasswordPage', () => {
  
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

  it('deve renderizar todos os elementos corretamente', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /esqueceu a senha/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar link de redefinição/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('deve exibir um erro se o e-mail for inválido', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    await user.type(emailInput, 'email-invalido');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);

    expect(await screen.findByText(/por favor, digite um endereço de e-mail válido/i)).toBeInTheDocument();
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it('deve chamar a API e exibir a mensagem de sucesso ao submeter um e-mail válido', async () => {
    const user = userEvent.setup();
    const successMessage = 'Se um usuário com este e-mail existir, um link de redefinição foi enviado.';
    forgotPassword.mockResolvedValue({ message: successMessage });
    
    renderComponent();

    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    await user.type(emailInput, 'teste@exemplo.com');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);

    // Espera a API ser chamada e verifica se foi com os argumentos corretos
    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledTimes(1);
      expect(forgotPassword).toHaveBeenCalledWith('teste@exemplo.com');
    });

    // Verifica se a mensagem de sucesso vinda da API é exibida
    expect(await screen.findByText(successMessage)).toBeInTheDocument();
    // Verifica se o campo foi limpo após o envio
    expect(emailInput).toHaveValue('');
  });

  it('deve exibir uma mensagem de erro genérica se a API falhar', async () => {
    const user = userEvent.setup();
    forgotPassword.mockRejectedValue(new Error('Erro de rede'));

    renderComponent();

    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    await user.type(emailInput, 'teste@exemplo.com');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);
    
    // Verifica se a mensagem de erro genérica do 'catch' é exibida
    expect(await screen.findByText(/Ocorreu um erro. Por favor, tente novamente mais tarde./i)).toBeInTheDocument();
  });
});
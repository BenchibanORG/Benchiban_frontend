import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordPage from './ForgotPasswordPage';

describe('ForgotPasswordPage', () => {
  
  beforeEach(() => {
    render(
      <BrowserRouter>
        <ForgotPasswordPage />
      </BrowserRouter>
    );
  });

  it('deve renderizar todos os elementos corretamente', () => {
    expect(screen.getByRole('heading', { name: /esqueceu a senha/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/endereço de e-mail/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar link de redefinição/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar para o login/i })).toBeInTheDocument();
  });

  it('deve exibir um erro se o e-mail for inválido', async () => {
    const user = userEvent.setup();
    
    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    await user.type(emailInput, 'email-invalido');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);

    expect(await screen.findByText(/por favor, digite um endereço de e-mail válido/i)).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de sucesso ao submeter um e-mail válido', async () => {
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    await user.type(emailInput, 'teste@exemplo.com');

    const submitButton = screen.getByRole('button', { name: /enviar link de redefinição/i });
    await user.click(submitButton);

    expect(await screen.findByText(/se um usuário com este e-mail existir/i)).toBeInTheDocument();
    // Verifica se o campo foi limpo após o envio
    expect(emailInput.value).toBe('');
  });
});
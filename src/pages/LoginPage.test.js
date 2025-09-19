import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';

describe('Página de Login', () => {

  // A função renderiza o componente para cada teste, garantindo um ambiente limpo.
  const renderLoginComponent = () => {
    return render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar o título "LOGIN"', () => {
    renderLoginComponent();
    const titleElement = screen.getByRole('heading', { name: /login/i });
    expect(titleElement).toBeInTheDocument();
  });

  it('deve renderizar o campo de e-mail', () => {
    renderLoginComponent();
    const emailInput = screen.getByLabelText(/endereço de e-mail/i);
    expect(emailInput).toBeInTheDocument();
  });

  it('deve renderizar o campo de senha', () => {
    renderLoginComponent();
    // --- CORREÇÃO DEFINITIVA AQUI ---
    // A busca agora inclui o asterisco obrigatório (*) que o MUI adiciona.
    const passwordInput = screen.getByLabelText(/^Senha \*$/i);
    expect(passwordInput).toBeInTheDocument();
  });

  it('deve renderizar o checkbox "Lembre de mim"', () => {
    renderLoginComponent();
    const rememberMeCheckbox = screen.getByLabelText(/lembre de mim/i);
    expect(rememberMeCheckbox).toBeInTheDocument();
  });

  it('deve renderizar o botão de login', () => {
    renderLoginComponent();
    const loginButton = screen.getByRole('button', { name: /login/i });
    expect(loginButton).toBeInTheDocument();
  });

  it('deve renderizar o link para a página de cadastro', () => {
    renderLoginComponent();
    const registerLink = screen.getByRole('link', { name: /crie uma/i });
    expect(registerLink).toBeInTheDocument();
  });

});
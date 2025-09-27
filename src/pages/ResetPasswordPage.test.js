import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordPage from './ResetPasswordPage';

describe('Página de Redefinir Senha', () => {
  // Função auxiliar para renderizar o componente dentro do contexto do roteador
  const renderComponent = () => {
    render(
      <BrowserRouter>
        <ResetPasswordPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar todos os elementos do formulário corretamente', () => {
    renderComponent();

    // Verifica se o título da página está presente
    expect(screen.getByText(/redefinir senha/i)).toBeInTheDocument();

    // Verifica se os campos de senha estão presentes
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-password-input')).toBeInTheDocument();

    // Verifica se o botão de submissão está presente
    expect(screen.getByRole('button', { name: /salvar nova senha/i })).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se as senhas não coincidirem', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Simula o usuário digitando senhas diferentes
    await user.type(screen.getByTestId('password-input'), 'senha123');
    await user.type(screen.getByTestId('confirm-password-input'), 'senha456');

    // Simula o clique no botão
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    // Verifica se a mensagem de erro específica aparece na tela
    expect(await screen.findByText('As senhas não coincidem!')).toBeInTheDocument();
  });

  it('deve exibir uma mensagem de sucesso ao submeter senhas válidas', async () => {
    const user = userEvent.setup();
    renderComponent();

    // Simula o usuário digitando senhas iguais
    await user.type(screen.getByTestId('password-input'), 'novaSenhaSegura');
    await user.type(screen.getByTestId('confirm-password-input'), 'novaSenhaSegura');

    // Simula o clique no botão
    await user.click(screen.getByRole('button', { name: /salvar nova senha/i }));

    // Verifica se a mensagem de sucesso simulada aparece na tela
    expect(await screen.findByText(/sua senha foi redefinida com sucesso/i)).toBeInTheDocument();
  });
});
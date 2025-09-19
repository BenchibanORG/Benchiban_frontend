import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import * as api from '../services/api';

// Simula todo o módulo de api
jest.mock('../services/api');

describe('RegisterPage', () => {
  
  // Helper para renderizar o componente dentro do Router
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  // Limpa os mocks após cada teste para garantir isolamento
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve cadastrar um usuário com sucesso ao submeter o formulário', async () => {
    // Arrange: Preparamos o mock para simular uma resposta de sucesso
    api.registerUser.mockResolvedValue({ id: 1, email: 'teste@teste.com' });
    
    renderComponent();
    
    // Act: Simulamos o usuário digitando nos campos
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha \*$/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'senha123' } });
    
    // Simulamos o clique no botão
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Assert: Verificamos se a mensagem de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
    });
    
    // Verifica se a função de API foi chamada corretamente
    expect(api.registerUser).toHaveBeenCalledWith('teste@teste.com', 'senha123');
  });

  it('deve mostrar erro quando as senhas não coincidem', async () => {
    renderComponent();
    
    // Preenche o formulário com senhas diferentes
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'teste@teste.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha \*$/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'senhadiferente' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText(/as senhas não coincidem/i)).toBeInTheDocument();
    });
    
    // Verifica que a função de API NÃO foi chamada
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it('deve mostrar erro quando o email é inválido', async () => {
    renderComponent();
    
    // Preenche o formulário com email inválido
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'email-invalido' } });
    fireEvent.change(screen.getByLabelText(/^Senha \*$/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'senha123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Verifica se a mensagem de erro aparece
    await waitFor(() => {
      expect(screen.getByText(/por favor, digite um email válido/i)).toBeInTheDocument();
    });
    
    // Verifica que a função de API NÃO foi chamada
    expect(api.registerUser).not.toHaveBeenCalled();
  });

  it('deve mostrar erro da API quando o cadastro falha no backend', async () => {
    // Arrange: Mock da API retornando erro
    api.registerUser.mockRejectedValue(new Error('Email já cadastrado'));
    
    renderComponent();
    
    // Preenche o formulário
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'existente@teste.com' } });
    fireEvent.change(screen.getByLabelText(/^Senha \*$/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/confirmar senha/i), { target: { value: 'senha123' } });
    
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Verifica se a mensagem de erro da API aparece
    await waitFor(() => {
      expect(screen.getByText(/email já cadastrado/i)).toBeInTheDocument();
    });
  });

});
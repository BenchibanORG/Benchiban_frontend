import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RegisterPage from './RegisterPage';
import * as api from '../services/api';

jest.mock('../services/api');

describe('RegisterPage', () => {
  
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <RegisterPage />
      </BrowserRouter>
    );
  };

  it('deve cadastrar um usuário com sucesso ao submeter o formulário', async () => {
    api.registerUser.mockResolvedValue({ id: 1, email: 'teste@teste.com' });
    
    renderComponent();
    
    // Act: Simulamos o usuário digitando nos campos
    // A busca pelo campo de email continua a mesma
    fireEvent.change(screen.getByLabelText(/endereço de e-mail/i), { target: { value: 'teste@teste.com' } });
    
    // --- LINHAS CORRIGIDAS ---
    // Tornamos a busca mais específica para cada campo de senha
    fireEvent.change(screen.getByLabelText(/^Senha \*$/i), { target: { value: 'senha123' } });
    fireEvent.change(screen.getByLabelText(/Confirmar Senha/i), { target: { value: 'senha123' } });
    // -------------------------
    
    // Simulamos o clique no botão
    fireEvent.click(screen.getByRole('button', { name: /cadastrar/i }));
    
    // Assert: Verificamos se a mensagem de sucesso aparece
    await waitFor(() => {
      expect(screen.getByText(/cadastro realizado com sucesso/i)).toBeInTheDocument();
    });
  });

});
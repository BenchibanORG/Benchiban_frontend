import axios from 'axios';
import { login } from './api'; 

// Simula o módulo 'axios'
jest.mock('axios');

describe('Função de Login', () => {
  it('deve retornar dados do token em um login bem-sucedido', async () => {
    // 1. Arrange
    const email = 'teste@teste.com';
    const password = '123';
    const mockTokenData = { access_token: 'fake-jwt-token', token_type: 'bearer' };

    // Mock do axios simula uma resposta de sucesso
    axios.post.mockResolvedValue({ data: mockTokenData });

    // 2. Act
    const result = await login(email, password);

    // 3. Assert
    // Verifica se o axios.post foi chamado com os dados corretos
    expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/auth/login', {
      email: email,
      password: password,
    });
    
    // Verifica se o resultado da função é o que esperamos
    expect(result).toEqual(mockTokenData);
    
  });
});
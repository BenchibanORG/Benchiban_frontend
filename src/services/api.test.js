import axios from 'axios';
// Importa as funções corretas
import { registerUser, loginUser } from './api';

jest.mock('axios');

describe('Funções da API de Autenticação', () => {
  
  // Limpa os mocks após cada teste para garantir que um não interfira no outro
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Testes para a função de REGISTRO ---
  describe('registerUser', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const mockData = { id: 1, email: 'teste@teste.com' };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await registerUser('teste@teste.com', '123');
      
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/register', { email: 'teste@teste.com', password: '123' });
      expect(result).toEqual(mockData);
    });

    it('deve lançar um erro quando o registro falhar no backend', async () => {
      // Arrange: Prepara o cenário de falha com uma mensagem de erro
      const errorMessage = 'Email already registered';
      // Simula a API retornando um erro, no formato que o FastAPI envia
      axios.post.mockRejectedValue({ response: { data: { detail: errorMessage } } });

      // Act & Assert: Verifica se a chamada da função realmente lança uma exceção com a mensagem correta
      await expect(registerUser('existente@teste.com', 'senha123')).rejects.toThrow(errorMessage);
    });
  });

  describe('loginUser', () => {
    it('deve retornar dados do token em um login bem-sucedido', async () => {
      const mockTokenData = { access_token: 'fake-jwt-token', token_type: 'bearer' };
      axios.post.mockResolvedValue({ data: mockTokenData });

      const result = await loginUser('teste@teste.com', '123');

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/login', {
        email: 'teste@teste.com',
        password: '123',
      });
      expect(result).toEqual(mockTokenData);
    });

    it('deve lançar um erro quando o login falhar', async () => {
      // Arrange: Prepara o cenário de falha
      const errorMessage = 'Credenciais inválidas';
      axios.post.mockRejectedValue({ response: { data: { detail: errorMessage } } });

      // Act & Assert: Verifica se a chamada da função lança a exceção esperada
      await expect(loginUser('errado@teste.com', 'senhaerrada')).rejects.toThrow(errorMessage);
    });
  });
});
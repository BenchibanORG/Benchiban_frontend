import axios from 'axios';
// Importa as funções corretas
import { registerUser, loginUser } from './api';

jest.mock('axios');

describe('Funções da API', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const mockData = { id: 1, email: 'teste@teste.com' };
      axios.post.mockResolvedValue({ data: mockData });
      const result = await registerUser('teste@teste.com', '123');
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/auth/register', { email: 'teste@teste.com', password: '123' });
      expect(result).toEqual(mockData);
    });
  });

  describe('loginUser', () => {
    it('deve retornar dados do token em um login bem-sucedido', async () => {
      const mockTokenData = { access_token: 'fake-jwt-token', token_type: 'bearer' };
      axios.post.mockResolvedValue({ data: mockTokenData });

      // Usa o nome correto da função
      const result = await loginUser('teste@teste.com', '123');

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/auth/login', {
        email: 'teste@teste.com',
        password: '123',
      });
      expect(result).toEqual(mockTokenData);
    });
  });
});
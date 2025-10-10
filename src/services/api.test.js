import axios from 'axios';
// --- MELHORIA AQUI ---
// Importamos todas as quatro funções para testá-las.
import { registerUser, loginUser, forgotPassword, resetPassword } from './api';

jest.mock('axios');

describe('Funções da API de Autenticação', () => {
  
  // Limpa os mocks após cada teste para garantir que um não interfira no outro
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const mockData = { id: 1, email: 'teste@teste.com' };
      axios.post.mockResolvedValue({ data: mockData });

      const result = await registerUser('teste@teste.com', '123');
      
      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/register', { email: 'teste@teste.com', password: '123' });
      expect(result).toEqual(mockData);
    });

    it('deve lançar um erro quando o registro falhar no backend', async () => {
      const errorMessage = 'Email already registered';
      axios.post.mockRejectedValue({ response: { data: { detail: errorMessage } } });

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
      const errorMessage = 'Credenciais inválidas';
      axios.post.mockRejectedValue({ response: { data: { detail: errorMessage } } });

      await expect(loginUser('errado@teste.com', 'senhaerrada')).rejects.toThrow(errorMessage);
    });
  });

  describe('forgotPassword', () => {
    it('deve enviar a solicitação com sucesso', async () => {
      const mockResponse = { message: 'Link de redefinição enviado.' };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await forgotPassword('teste@exemplo.com');

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/forgot-password', { email: 'teste@exemplo.com' });
      expect(result).toEqual(mockResponse);
    });

    it('deve relançar um erro quando a API falhar', async () => {
      const apiError = new Error('Erro de rede');
      axios.post.mockRejectedValue(apiError);

      await expect(forgotPassword('teste@exemplo.com')).rejects.toThrow('Erro de rede');
    });
  });

  describe('resetPassword', () => {
    it('deve redefinir a senha com sucesso', async () => {
      const mockResponse = { message: 'Senha redefinida com sucesso.' };
      axios.post.mockResolvedValue({ data: mockResponse });

      const result = await resetPassword('token-valido', 'novaSenha123');

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/api/auth/reset-password', {
        token: 'token-valido',
        new_password: 'novaSenha123',
      });
      expect(result).toEqual(mockResponse);
    });

    it('deve relançar um erro quando a API falhar', async () => {
      const apiError = new Error('Token inválido');
      axios.post.mockRejectedValue(apiError);

      await expect(resetPassword('token-invalido', 'novaSenha123')).rejects.toThrow('Token inválido');
    });
  });
});
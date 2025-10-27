import axios from 'axios';
import { registerUser, loginUser, forgotPassword, resetPassword, getProductComparison } from './api';

jest.mock('axios');

const mockComparisonData = {
  results_by_source: {
    ebay: [{ title: 'Item eBay 1', price_brl: 500.0 }],
  },
  overall_best_deal: { title: 'Item eBay 1', price_brl: 500.0 }
};

describe('Funções da API', () => {
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  // --- Testes para registerUser
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

  // --- Testes para loginUser
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

  // --- Testes para forgotPassword
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

  // --- Testes para resetPassword
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

  // --- Testes para getProductComparison ---
  describe('getProductComparison', () => {
    it('deve buscar a comparação de produtos com sucesso', async () => {
      // Configura o mock do axios.get para retornar os dados simulados
      axios.get.mockResolvedValue({ data: mockComparisonData });
      
      const query = 'rtx 4080';
      const result = await getProductComparison(query);

      // Verifica se axios.get foi chamado com a URL e os parâmetros corretos
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/api/products/comparison', {
        params: { q: query }
      });

      // Verifica se o resultado retornado é o esperado
      expect(result).toEqual(mockComparisonData);
    });

    it('deve relançar um erro quando a busca falhar', async () => {
      // Configura o mock do axios.get para simular um erro
      const apiError = new Error('Erro na API de comparação');
      axios.get.mockRejectedValue(apiError);

      const query = 'rtx 4080';
      // Verifica se a função getProductComparison relança a exceção
      await expect(getProductComparison(query)).rejects.toThrow('Erro na API de comparação');

      // Garante que axios.get foi chamado mesmo assim
      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/api/products/comparison', {
        params: { q: query }
      });
    });
  });
});
import axios from 'axios';
import {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProductComparison,
  getExchangeRate,
} from './api';

// Mock simples
jest.mock('axios');

const API_URL = 'http://localhost:8000';

describe('API Service - 100% cobertura (JavaScript puro)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registerUser - sucesso', async () => {
    const mockData = { message: 'Usuário criado com sucesso' };
    axios.post.mockResolvedValue({ data: mockData });

    const result = await registerUser('novo@teste.com', '123456');

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/register`, {
      email: 'novo@teste.com',
      password: '123456',
    });
    expect(result).toEqual(mockData);
  });

  it('registerUser - erro com mensagem do backend (cobre linha 20-21)', async () => {
    axios.post.mockRejectedValue({
      response: { data: { detail: 'E-mail já cadastrado' } },
    });

    await expect(registerUser('existe@teste.com', '123')).rejects.toThrow('E-mail já cadastrado');
  });

  it('registerUser - erro genérico (cobre fallback)', async () => {
    axios.post.mockRejectedValue({ response: {} });

    await expect(registerUser('a@a.com', '123')).rejects.toThrow('Ocorreu um erro ao tentar cadastrar.');
  });

  it('loginUser - sucesso', async () => {
    const token = { access_token: 'xyz123' };
    axios.post.mockResolvedValue({ data: token });

    const result = await loginUser('user@teste.com', '123');
    expect(result).toEqual(token);
  });

  it('loginUser - erro personalizado', async () => {
    axios.post.mockRejectedValue({
      response: { data: { detail: 'Credenciais inválidas' } },
    });

    await expect(loginUser('user@teste.com', 'errada')).rejects.toThrow('Credenciais inválidas');
  });

  it('forgotPassword - sucesso', async () => {
    axios.post.mockResolvedValue({ data: { message: 'E-mail enviado' } });
    await expect(forgotPassword('reset@teste.com')).resolves.toBeDefined();
  });

  it('resetPassword - sucesso', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Senha alterada' } });
    await resetPassword('token123', 'nova123');

    expect(axios.post).toHaveBeenCalledWith(`${API_URL}/api/auth/reset-password`, {
      token: 'token123',
      new_password: 'nova123',
    });
  });

  it('getProductComparison - busca com query', async () => {
    const mockData = { overall_best_deal: { title: 'RTX 5090' } };
    axios.get.mockResolvedValue({ data: mockData });

    const result = await getProductComparison('RTX 5090');

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/products/comparison`, {
      params: { q: 'RTX 5090' },
    });
    expect(result).toEqual(mockData);
  });

  it('getExchangeRate - sucesso com refresh=true', async () => {
    const rateData = { rate: 5.6789 };
    axios.get.mockResolvedValue({ data: rateData });

    const result = await getExchangeRate(true);

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/exchange-rate`, {
      params: { refresh: true },
    });
    expect(result).toEqual(rateData);
  });

  it('getExchangeRate - usa refresh=false por padrão', async () => {
    axios.get.mockResolvedValue({ data: { rate: 5.5 } });

    await getExchangeRate();

    expect(axios.get).toHaveBeenCalledWith(`${API_URL}/api/exchange-rate`, {
      params: { refresh: false },
    });
  });

  it('getExchangeRate - erro: loga no console e relança (cobre linhas 89-96)', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const error = new Error('API fora do ar');

    axios.get.mockRejectedValue(error);

    await expect(getExchangeRate()).rejects.toThrow();

    expect(consoleSpy).toHaveBeenCalledWith('Erro na API de cotação:', error);
    consoleSpy.mockRestore();
  });
});
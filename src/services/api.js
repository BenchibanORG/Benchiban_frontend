import axios from 'axios';

// A URL base da sua API que está rodando no Docker.
const API_URL = 'http://localhost:8000';

/**
 * Registra um novo usuário.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} Os dados do usuário criado.
 * @throws {Error} Lança um erro se o cadastro falhar, com a mensagem vinda do backend.
 */
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/register`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Ocorreu um erro ao tentar cadastrar.';
    throw new Error(errorMessage);
  }
};

/**
 * Autentica um usuário e retorna um token de acesso.
 * @param {string} email - O email do usuário.
 * @param {string} password - A senha do usuário.
 * @returns {Promise<object>} Objeto com o access_token.
 * @throws {Error} Lança um erro se a autenticação falhar.
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.detail || 'Ocorreu um erro ao tentar fazer o login.';
    throw new Error(errorMessage);
  }
};

/**
 * Envia uma solicitação para iniciar o processo de redefinição de senha.
 * @param {string} email - O email do usuário.
 * @returns {Promise<object>} A resposta da API.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    // Relança o erro para o componente tratar
    throw error;
  }
};

/**
 * Envia o token e a nova senha para efetivar a redefinição.
 * @param {string} token - O token recebido por email.
 * @param {string} newPassword - A nova senha digitada pelo usuário.
 * @returns {Promise<object>} A resposta da API.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
      token: token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    // Relança o erro para o componente tratar
    throw error;
  }
};

/**
 * Busca por um produto em todas as fontes configuradas no backend.
 * Retorna os resultados agrupados por fonte e a melhor oferta geral.
 * @param {string} query - O termo de busca para o produto.
 * @returns {Promise<object>} Objeto com 'results_by_source' e 'overall_best_deal'.
 */
export const getProductComparison = async (query) => {
  try {
    // Faz a chamada GET para o novo endpoint, passando a query como parâmetro
    const response = await axios.get(`${API_URL}/api/products/comparison`, {
      params: { q: query } // Passa a query string corretamente
    });
    return response.data; // Retorna a estrutura { results_by_source: {...}, overall_best_deal: {...} }
  } catch (error) {
    // Relança o erro para o componente tratar
    throw error;
  }
};


import axios from 'axios';

/**Conexão com o Backend */
//const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
const API_URL = 'http://localhost:8000';
console.log('Ambiente:', process.env.NODE_ENV);
console.log('Conectando ao Backend em:', API_URL);

/**
 * Registra um novo usuário.
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
 * Autentica um usuário.
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
 * Solicitação de reset de senha.
 */
export const forgotPassword = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Efetiva a redefinição de senha.
 */
export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_URL}/api/auth/reset-password`, {
      token: token,
      new_password: newPassword,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Busca comparação de produtos.
 */
export const getProductComparison = async (query) => {
  try {
    const response = await axios.get(`${API_URL}/api/products/comparison`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// --- Função para buscar a cotação do Dólar ---
/**
 * Obtém a cotação atual do Dólar (USD) para Real (BRL).
 * @param {boolean} refresh - Se true, força a atualização via API externa no backend.
 * @returns {Promise<object>} 
 */
export const getExchangeRate = async (refresh = false) => {
  try {
    const response = await axios.get(`${API_URL}/api/exchange-rate`, {
      params: { refresh }
    });
    return response.data;
  } catch (error) {
    console.error("Erro na API de cotação:", error);
    throw error;
  }
};

const api = {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
  getProductComparison,
  getExchangeRate,
};

export default api;
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
    const response = await axios.post(`${API_URL}/auth/register`, {
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
    // Faz uma requisição POST para o endpoint /auth/login
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    // Se o login for bem-sucedido, retorna os dados (que contêm o token)
    return response.data;
  } catch (error) {
    // Se o login falhar, extrai a mensagem de erro específica do backend
    const errorMessage = error.response?.data?.detail || 'Ocorreu um erro ao tentar fazer o login.';
    // Lança um novo erro com essa mensagem para ser tratado no componente
    throw new Error(errorMessage);
  }
};
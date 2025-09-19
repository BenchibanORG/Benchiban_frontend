import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    //Mensagem de erro da resposta da API 
    const message = error.response?.data?.detail || error.message;
    throw new Error(message);
  }
};

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
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Hook personalizado para gerir a lógica de submissão de formulários de autenticação.
 * @param {function} authApiCall - A função de API a ser chamada
 * @param {string} successRedirectPath - A rota para onde navegar em caso de sucesso.
 * @param {string} successMessage - A mensagem a exibir em caso de sucesso.
 */
export const useAuthSubmit = (authApiCall, successRedirectPath, successMessage) => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (apiParams) => {
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const response = await authApiCall(...apiParams);
      
      if (response && response.access_token) {
        localStorage.setItem('token', response.access_token);
      }

      setSuccess(successMessage);
      
      setTimeout(() => {
        navigate(successRedirectPath);
      }, 2000);

    } catch (err) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
      setIsLoading(false);
    }
  };

  return { isLoading, error, success, handleSubmit, setError, setSuccess };
};
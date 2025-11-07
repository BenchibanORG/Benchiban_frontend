import React from 'react';
// --- 1. REMOVE O 'useLocation' DA IMPORTAÇÃO ---
import { Navigate, Outlet } from 'react-router-dom';

/**
 * Esta função verifica se o utilizador está autenticado
 * ao procurar o token no localStorage.
 */
const useAuth = () => {
  const token = localStorage.getItem('token');
  return !!token; 
};

/**
 * Este componente verifica se o utilizador está autenticado.
 */
const ProtectedRoute = () => {
  const isAuth = useAuth();
  
  // --- 2. REMOVE A LINHA 'const location = useLocation()' ---
  // A variável 'location' não era necessária aqui.

  if (!isAuth) {
    // Se não estiver autenticado, redireciona para /login
    // Passamos a mensagem no 'state' para a LoginPage a poder ler
    return (
      <Navigate 
        to="/login" 
        state={{ message: "Você precisa estar logado para aceder a esta página." }} 
        replace 
      />
    );
  }

  // Se estiver autenticado, renderiza o componente filho (ex: DashboardPage)
  return <Outlet />;
};

export default ProtectedRoute;
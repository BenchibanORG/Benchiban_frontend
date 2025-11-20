import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  // Se existir token, redireciona imediatamente para o dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Caso contrário, renderiza conteúdo público normalmente
  return children;
};

export default PublicRoute;

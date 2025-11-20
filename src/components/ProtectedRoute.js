import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to="/login"
        state={{ from: location, unauthorized: true }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;

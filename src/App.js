import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota para a página de Login (será a página inicial) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rota para a página de Cadastro */}
        <Route path="/register" element={<RegisterPage />} />

        {/* Rota para a página principal após o login */}
        <Route path="/dashboard" element={<DashboardPage />} /> 

        {/* Rota padrão: redireciona para /login se nenhuma outra rota combinar */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage'; 
// -----------------------------------------

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

        {/* Rota para a página que exibe os resultados da busca */}
        <Route path="/results" element={<ResultsPage />} /> 

        {/* Rotas para redefinir senha */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* ------------------------------------ */}

        {/* Rota padrão: redireciona para /login se nenhuma outra rota combinar */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
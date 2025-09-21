import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';

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

        {/* Rota padrão: redireciona para /login se nenhuma outra rota combinar */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
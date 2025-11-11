import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ResultsPage from './pages/ResultsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/ProtectedRoute';
// -----------------------------------------

function App() {
  return (
    <Router>
      <Routes>
        {/* --- 2. ROTAS PÚBLICAS --- */}
        {/* Estas rotas podem ser acedidas por qualquer pessoa */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* --- 3. ROTAS PROTEGIDAS --- */}
        {/* Estas rotas só podem ser acedidas por utilizadores logados */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/results" element={<ResultsPage />} />
          
          {/* Se a sua Dashboard for também a página inicial, adicione-a aqui */}
          <Route path="/login" element={<LoginPage />} />
        </Route>
        
        {/* (Opcional: Adicionar uma rota 404 Not Found) */}
        
      </Routes>
    </Router>
  );
}

export default App;
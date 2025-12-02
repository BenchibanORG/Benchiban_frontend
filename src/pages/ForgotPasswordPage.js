// src/pages/ForgotPasswordPage.js
import React, { useState, useEffect } from 'react'; // Adicionado useEffect
import { Link as RouterLink, useNavigate } from 'react-router-dom'; // Adicionado useNavigate
import { Link, Typography } from '@mui/material';
import { forgotPassword } from '../services/api';
import AuthPageLayout from '../components/AuthPageLayout';
import AuthFormWrapper from '../components/AuthFormWrapper';
import StyledAuthTextField from '../components/StyledAuthTextField';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Hook de navegação

  // --- LÓGICA DE PROTEÇÃO---
  // Se o usuário já estiver logado, encaminha para dashboard
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);
  // ------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    
    // Regex robusto para validação de email
    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    
    if (!email || !emailRegex.test(email)) {
      setError('Por favor, digite um endereço de e-mail válido.');
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      setSuccess(response.message);
      // Opcional: Limpar o campo apenas se quiser forçar o usuário a ler a mensagem
      setEmail(''); 
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const bottomLink = (
    <Typography variant="body2" color="text.secondary">
      <Link 
        component={RouterLink} 
        to="/login" 
        variant="body2"
        sx={{ 
          color: '#001f3f', 
          fontWeight: 600, 
          textDecoration: 'none', 
          '&:hover': { 
            color: '#003d7a', 
            textDecoration: 'underline' 
          } 
        }}
      >
        Voltar para o Login
      </Link>
    </Typography>
  );

  return (
    <AuthPageLayout
      title="Esqueceu a senha?"
      subtitle="Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha"
    >
      <AuthFormWrapper
        onSubmit={handleSubmit}
        buttonText="Enviar Link de Redefinição"
        isLoading={isLoading}
        error={error}
        success={success}
        bottomLink={bottomLink}
      >
        <StyledAuthTextField
          label="Endereço de E-mail"
          id="email"
          name="email"
          autoComplete="email"
          autoFocus
          placeholder="seu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </AuthFormWrapper>
    </AuthPageLayout>
  );
}

export default ForgotPasswordPage;
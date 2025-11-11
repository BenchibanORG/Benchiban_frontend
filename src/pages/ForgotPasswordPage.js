import React, { useState } from 'react';
import { Box, TextField, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { forgotPassword } from '../services/api';
import AuthFormWrapper from '../components/AuthFormWrapper';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegex.test(email)) {
      setError('Por favor, digite um endereço de e-mail válido.');
      return;
    }
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      setSuccess(response.message);
      setEmail('');
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  // Componente de link inferior
  const bottomLink = (
    <Link
      component={RouterLink}
      to="/login"
      sx={{
        color: '#001f3f',
        fontWeight: 600,
        textDecoration: 'none',
        '&:hover': {
          color: '#003d7a',
          textDecoration: 'underline',
        },
      }}
    >
      Voltar para o Login
    </Link>
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
        {/* Campo único do formulário */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Endereço de E-mail
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
                borderRadius: 2,
                '&:hover fieldset': { borderColor: '#001f3f' },
                '&.Mui-focused fieldset': { borderColor: '#001f3f', borderWidth: 2 },
              },
            }}
          />
        </Box>
      </AuthFormWrapper>
    </AuthPageLayout>
  );
}

export default ForgotPasswordPage;
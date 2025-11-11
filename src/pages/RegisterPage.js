import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Link, Typography, InputAdornment, IconButton } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../services/api';
import AuthPageLayout from '../components/AuthPageLayout';
import AuthFormWrapper from '../components/AuthFormWrapper';
// Importa os novos componentes
import StyledAuthTextField from '../components/StyledAuthTextField';
import { useAuthSubmit } from '../hooks/useAuthSubmit';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Usa o Hook personalizado
  const { isLoading, error, success, handleSubmit, setError } = useAuthSubmit(
    registerUser,
    '/login',
    'Cadastro realizado com sucesso! Redirecionando para o login...'
  );

  const handleLocalSubmit = (event) => {
    event.preventDefault();
    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um email válido.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    handleSubmit([email, password]);
  };

  const bottomLink = (
    <Typography variant="body2" color="text.secondary">
      Já tem uma conta?{' '}
      <Link component={RouterLink} to="/login" sx={{ color: '#001f3f', fontWeight: 600, textDecoration: 'none', '&:hover': { color: '#003d7a', textDecoration: 'underline' } }}>
        Faça o login
      </Link>
    </Typography>
  );

  return (
    <AuthPageLayout
      title="Crie sua conta"
      subtitle="Preencha os dados abaixo para começar"
    >
      <AuthFormWrapper
        onSubmit={handleLocalSubmit}
        buttonText="CRIAR CONTA"
        isLoading={isLoading}
        error={error}
        success={success}
        bottomLink={bottomLink}
      >
        {/* --- CÓDIGO REDUZIDO --- */}
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
        <StyledAuthTextField
          label="Senha"
          name="password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          autoComplete="new-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <StyledAuthTextField
          label="Confirmar Senha"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          autoComplete="new-password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </AuthFormWrapper>
    </AuthPageLayout>
  );
}

export default RegisterPage;
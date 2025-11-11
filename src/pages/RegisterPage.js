import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Link,
  Typography,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../services/api';
import AuthPageLayout from '../components/AuthPageLayout';
import AuthFormWrapper from '../components/AuthFormWrapper';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um email válido.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }
    setIsLoading(true);
    try {
      await registerUser(email, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Componente de link inferior
  const bottomLink = (
    <Typography variant="body2" color="text.secondary">
      Já tem uma conta?{' '}
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
        onSubmit={handleSubmit}
        buttonText="CRIAR CONTA"
        isLoading={isLoading}
        error={error}
        success={success}
        bottomLink={bottomLink}
      >
        {/* Campos únicos do formulário de registo */}
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Senha
          </Typography>
          <TextField
            required
            fullWidth
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

        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>
            Confirmar Senha
          </Typography>
          <TextField
            required
            fullWidth
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

export default RegisterPage;
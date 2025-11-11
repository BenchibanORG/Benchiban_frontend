import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Link, 
  Typography,
  IconButton,
  InputAdornment
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../services/api';
import AuthPageLayout from '../components/AuthPageLayout';
import AuthFormWrapper from '../components/AuthFormWrapper';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');
    if (!email || !password) {
      setError('Por favor, preencha o e-mail e a senha.');
      return;
    }
    setIsLoading(true);
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.access_token);
      setSuccess('Login bem-sucedido! A redirecionar...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'E-mail ou senha inválidos. Tente novamente.');
      setIsLoading(false);
    }
  };

  // Componente de link inferior
  const bottomLink = (
    <Typography variant="body2" color="text.secondary">
      Ainda não tem conta?{' '}
      <Link
        component={RouterLink}
        to="/register"
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
        Crie uma agora
      </Link>
    </Typography>
  );

  // Componente de link "Esqueceu a senha?"
  const forgotPasswordLink = (
    <Link
      component={RouterLink}
      to="/forgot-password"
      variant="body2"
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
      Esqueceu a senha?
    </Link>
  );

  return (
    <AuthPageLayout
      title="Bem-vindo!"
      subtitle="Entre para acessar sua conta"
    >
      <AuthFormWrapper
        onSubmit={handleSubmit}
        buttonText="ENTRAR"
        isLoading={isLoading}
        error={error}
        success={success}
        links={forgotPasswordLink}
        bottomLink={bottomLink}
      >
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
            autoComplete="current-password"
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
      </AuthFormWrapper>
    </AuthPageLayout>
  );
}

export default LoginPage;
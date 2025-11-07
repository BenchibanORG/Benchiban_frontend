import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Link, 
  Typography,
  IconButton,
  InputAdornment,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../services/api';
import AuthPageLayout from '../components/AuthPageLayout';

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

  return (
    <AuthPageLayout
      title="Bem-vindo!"
      subtitle="Entre para acessar sua conta"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
          >
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
                '&:hover fieldset': {
                  borderColor: '#001f3f',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#001f3f',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
          >
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
                '&:hover fieldset': {
                  borderColor: '#001f3f',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#001f3f',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
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
        </Box>

        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            py: 1.8,
            borderRadius: 2,
            bgcolor: '#001f3f',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)',
            '&:hover': {
              bgcolor: '#003d7a',
              boxShadow: '0 6px 16px rgba(0, 31, 63, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'ENTRAR'}
        </Button>

        <Box
          sx={{
            position: 'relative',
            my: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              bgcolor: 'grey.300',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'white',
              px: 2,
              color: 'text.secondary',
            }}
          >
            ou
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
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
        </Box>
      </Box>
    </AuthPageLayout>
  );
}

export default LoginPage;
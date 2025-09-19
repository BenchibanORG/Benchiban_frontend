import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Grid,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { registerUser } from '../services/api';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6c63ff',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    // Validação de formato de e-mail adicionada
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, digite um email válido.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      await registerUser(email, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              mb: 3,
            }}
          >
            CRIAR CONTA
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            
            {/* Exibe a mensagem de erro, se houver */}
            {error && <Alert severity="error" sx={{ my: 2, width: '100%' }}>{error}</Alert>}
            
            {/* Exibe a mensagem de sucesso, se houver */}
            {success && <Alert severity="success" sx={{ my: 2, width: '100%' }}>{success}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirmar Senha"
              type="password"
              variant="filled"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              CADASTRAR
            </Button>
            
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2" sx={{ color: 'text.secondary' }}>
                  Já tem uma conta? Faça o login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default RegisterPage;
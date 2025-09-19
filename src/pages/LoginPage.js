import React, { useState } from 'react'; // 1. useState importado
import { useNavigate } from 'react-router-dom'; // 2. useNavigate importado
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Grid,
  Alert
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { loginUser } from '../services/api';

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

function LoginPage() {
  // --- BLOCO FALTANTE ADICIONADO AQUI ---
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // ------------------------------------

  const handleSubmit = async (event) => {
  event.preventDefault();
  setError('');

  // Validação de campos obrigatórios
  if (!email || !password) {
    setError('Por favor, preencha todos os campos');
    return;
  }

  try {
    const data = await loginUser(email, password);
    
    if (data.access_token) {
      localStorage.setItem('authToken', data.access_token);
      alert('Login bem-sucedido!');
      navigate('/dashboard'); 
    }
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
            LOGIN
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            
            {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha" 
              type="password"
              id="password"
              autoComplete="current-password"
              variant="filled"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                mt: 1, 
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembre de mim"
              />
              <Link href="#" variant="body2" sx={{ color: 'text.secondary' }}>
                Esqueceu a senha?
              </Link>
            </Box>

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
              LOGIN
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'text.secondary' }}>
                  {"Ainda não tem Conta? Crie uma!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
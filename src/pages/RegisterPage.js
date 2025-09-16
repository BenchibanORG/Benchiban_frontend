import React, { useState } from 'react'; // 1. Importa o useState
import { useNavigate } from 'react-router-dom'; // 2. Importa o hook para navegação
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
import { registerUser } from '../services/api'; // 4. Importa nossa função da API

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
  // 5. Gerenciamento de estado para os campos do formulário e feedback
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // Hook para redirecionar o usuário

  // 6. Função para lidar com a submissão do formulário
  const handleSubmit = async (event) => {
    event.preventDefault(); // Previne o recarregamento padrão da página
    setError(''); // Limpa erros anteriores
    setSuccess('');

    // Validação simples
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      // Chama a função da API
      await registerUser(email, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      
      // Redireciona para a página de login após 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // Captura o erro lançado pela nossa função da API
      setError(err.message);
    }
  };

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container component="main" maxWidth="xs">
        <Box>
          <Typography component="h1" variant="h5">
            CRIAR CONTA
          </Typography>

          {/* 7. Formulário com `onSubmit` e campos controlados */}
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            
            {/* Exibe a mensagem de erro, se houver */}
            {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
            {/* Exibe a mensagem de sucesso, se houver */}
            {success && <Alert severity="success" sx={{ mt: 2, width: '100%' }}>{success}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              variant="filled"
              value={email}
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado
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
              onChange={(e) => setPassword(e.target.value)} // Atualiza o estado
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
              onChange={(e) => setConfirmPassword(e.target.value)} // Atualiza o estado
            />
            <Button type="submit" fullWidth variant="contained" disableElevation>
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
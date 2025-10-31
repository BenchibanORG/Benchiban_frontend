import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Alert, Link, Grid, CircularProgress, Typography } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import { loginUser } from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

    setIsLoading(true); // --- Inicia o carregamento
    try {
      const data = await loginUser(email, password);
      localStorage.setItem('token', data.access_token);
      setSuccess('Login bem-sucedido! A redirecionar...'); // Mensagem de sucesso

      // Navega para o Dashboard após 2 segundos
      setTimeout(() => {
        navigate('/dashboard'); // O 'isLoading' permanece true durante este tempo
      }, 2000);

    } catch (err) {
      setError(err.message || 'E-mail ou senha inválidos. Tente novamente.');
      setIsLoading(false); 
    } 

  };

  const pageTitle = (
    <Box sx={{ mb: 4, textAlign: 'center' }}>
      <Typography 
        variant="h2" 
        component="h1" 
        fontWeight="bold" 
        sx={{ 
          color: '#001f3f',
          fontFamily: 'Urban Shadow, sans-serif'
        }}
      >
        Benchiban
      </Typography>
      <Typography variant="h6" color="text.secondary">
        O melhor preço de GPU em primeiro lugar!
      </Typography>
    </Box>
  );

  return (
    <AuthLayout title={pageTitle}>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        
        {error && <Alert severity="error" sx={{ my: 2, width: '100%' }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2, width: '100%' }}>{success}</Alert>}
        
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
          name="password"
          label="Senha"
          type="password"
          id="password"
          autoComplete="current-password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
        </Button>
        <Grid container>
          <Grid item xs>
            <Link component={RouterLink} to="/forgot-password" variant="body2">
              Esqueceu a senha?
            </Link>
          </Grid>
          <Grid item>
            <Link component={RouterLink} to="/register" variant="body2">
              {"Ainda não tem conta? Crie uma!"}
            </Link>
          </Grid>
        </Grid>
      </Box>
    </AuthLayout>
  );
}

export default LoginPage;


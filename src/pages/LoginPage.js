import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link,
  Grid,
  Alert
} from '@mui/material';
import { loginUser } from '../services/api';
import AuthLayout from '../components/AuthLayout'; // Importa o novo layout

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    <AuthLayout title="LOGIN">
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
    </AuthLayout>
  );
}

export default LoginPage;
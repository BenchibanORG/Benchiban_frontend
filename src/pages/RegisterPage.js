import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Link,
  Grid,
  Alert
} from '@mui/material';
import { registerUser } from '../services/api';
import AuthLayout from '../components/AuthLayout'; // Importa o layout reutilizável

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

    // Validação de formato de e-mail
    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
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
    <AuthLayout title="CRIAR CONTA">
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
    </AuthLayout>
  );
}

export default RegisterPage;
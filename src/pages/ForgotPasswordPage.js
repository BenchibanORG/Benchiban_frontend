import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegex.test(email)) {
      setError('Por favor, digite um endereço de e-mail válido.');
      return;
    }
    // ---------------------------------------------------
    
    // LÓGICA DA API DO BACKEND (simulada por enquanto)
    console.log(`Solicitando redefinição de senha para: ${email}`);
    setSuccess('Se um usuário com este e-mail existir, um link de redefinição foi enviado.');
    // Limpa o campo de e-mail após a submissão
    setEmail(''); 
  };

  return (
    <AuthLayout title="ESQUECEU A SENHA?">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}

        <Typography variant="body2" align="center" sx={{ mb: 2 }}>
          Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha.
        </Typography>
        
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
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Enviar Link de Redefinição
        </Button>

        <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              Voltar para o Login
            </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
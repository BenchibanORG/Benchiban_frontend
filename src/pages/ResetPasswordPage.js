import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, TextField, Button, Alert, Link } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
// Supondo que você criará uma função 'resetPassword' no futuro
// import { resetPassword } from '../services/api'; 

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (!password || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    try {
      // A lógica para chamar a API de redefinição de senha virá aqui.
      // const token = new URLSearchParams(window.location.search).get('token');
      // await resetPassword(token, password);
      console.log('Senha redefinida com sucesso (simulado)');
      setSuccess('Sua senha foi redefinida com sucesso! Redirecionando...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.message || 'Ocorreu um erro ao redefinir a senha.');
    }
  };

  return (
    <AuthLayout title="REDEFINIR SENHA">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
        
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
        
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Nova Senha"
          type="password"
          variant="filled"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ 'data-testid': 'password-input' }}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="confirmPassword"
          label="Confirmar Nova Senha"
          type="password"
          variant="filled"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputProps={{ 'data-testid': 'confirm-password-input' }}
        />
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
        >
          Salvar Nova Senha
        </Button>
      </Box>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
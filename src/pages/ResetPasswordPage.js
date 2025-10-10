import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, TextField, Button, Alert } from '@mui/material';
import AuthLayout from '../components/AuthLayout';
import { resetPassword } from '../services/api';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

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
    if (!token) {
      setError('Token de redefinição ausente ou inválido. Por favor, solicite um novo link.');
      return;
    }

    try {
      setIsLoading(true);
      const response = await resetPassword(token, password);
      setSuccess(response.message + ' Redirecionando para o login...');
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      if (err.response && err.response.data && err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        setError('Ocorreu um erro ao redefinir a senha. Tente novamente.');
      }
      console.error("Falha ao redefinir senha:", err);
    } finally {
      setIsLoading(false);
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
          disabled={isLoading}
        >
          {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
        </Button>
      </Box>
    </AuthLayout>
  );
}

export default ResetPasswordPage;
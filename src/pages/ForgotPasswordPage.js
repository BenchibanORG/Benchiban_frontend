import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { forgotPassword } from '../services/api';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const emailRegex = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!email || !emailRegex.test(email)) {
      setError('Por favor, digite um endereço de e-mail válido.');
      return;
    }
    
    // --- LÓGICA DA API DO BACKEND ---
    try {
      setIsLoading(true); // Inicia o carregamento

      const response = await forgotPassword(email);
      
      // Usamos a mensagem de sucesso que a API nos retorna.
      setSuccess(response.message);
      setEmail(''); // Limpa o campo de e-mail após a submissão

    } catch (err) {
      // Em caso de erro de rede ou do servidor, exibimos uma mensagem genérica.
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      console.error("Falha na solicitação de redefinição de senha:", err); // Log para depuração
    } finally {
      setIsLoading(false); // Finaliza o carregamento, independentemente do resultado
    }
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
        
        {/* --- FEEDBACK VISUAL NO BOTÃO --- */}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2, py: 1.5 }}
          disabled={isLoading}
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
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
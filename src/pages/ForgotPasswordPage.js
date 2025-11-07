import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
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
    
    try {
      setIsLoading(true);
      const response = await forgotPassword(email);
      setSuccess(response.message);
      setEmail('');
    } catch (err) {
      setError('Ocorreu um erro. Por favor, tente novamente mais tarde.');
      console.error("Falha na solicitação de redefinição de senha:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthPageLayout
      title="Esqueceu a senha?"
      subtitle="Digite seu e-mail abaixo e enviaremos um link para você redefinir sua senha"
    >
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}
        
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="body2"
            sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
          >
            Endereço de E-mail
          </Typography>
          <TextField
            required
            fullWidth
            id="email"
            name="email"
            autoComplete="email"
            autoFocus
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f8fafc',
                borderRadius: 2,
                '&:hover fieldset': {
                  borderColor: '#001f3f',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#001f3f',
                  borderWidth: 2,
                },
              },
            }}
          />
        </Box>
        
        <Button
          type="submit"
          fullWidth
          variant="contained"
          disabled={isLoading}
          sx={{
            py: 1.8,
            borderRadius: 2,
            bgcolor: '#001f3f',
            fontWeight: 600,
            fontSize: '1rem',
            textTransform: 'none',
            boxShadow: '0 4px 12px rgba(0, 31, 63, 0.3)',
            '&:hover': {
              bgcolor: '#003d7a',
              boxShadow: '0 6px 16px rgba(0, 31, 63, 0.4)',
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
            transition: 'all 0.2s',
          }}
        >
          {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
        </Button>

        <Box
          sx={{
            position: 'relative',
            my: 3,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: '1px',
              bgcolor: 'grey.300',
            },
          }}
        >
          <Typography
            variant="body2"
            sx={{
              position: 'relative',
              display: 'inline-block',
              left: '50%',
              transform: 'translateX(-50%)',
              bgcolor: 'white',
              px: 2,
              color: 'text.secondary',
            }}
          >
            ou
          </Typography>
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Link
            component={RouterLink}
            to="/login"
            sx={{
              color: '#001f3f',
              fontWeight: 600,
              textDecoration: 'none',
              '&:hover': {
                color: '#003d7a',
                textDecoration: 'underline',
              },
            }}
          >
            Voltar para o Login
          </Link>
        </Box>
      </Box>
    </AuthPageLayout>
  );
}

export default ForgotPasswordPage;
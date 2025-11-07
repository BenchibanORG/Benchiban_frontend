import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Typography, 
  Container,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Security} from '@mui/icons-material';
import { forgotPassword } from '../services/api';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Lado Esquerdo - Azul Escuro */}
      <Box
        sx={{
          flex: 1,
          background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: 'white',
        }}
      >
        {/* Logo */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
              src={benchibanLogo}
              alt="Benchiban Logo"
              sx={{
                height: 100,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) invert(1)', // Inverte as cores (branco vira preto, preto vira branco)
              }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.05em',
            }}
          >
          </Typography>
        </Box>

        {/* Conteúdo Principal */}
        <Box sx={{ maxWidth: 500 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              mb: 3,
              lineHeight: 1.2,
            }}
          >
            Recupere sua conta
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Não se preocupe! Digite seu e-mail e enviaremos 
            instruções para redefinir sua senha.
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Security sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Processo Seguro
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Link válido por apenas 15 minutos
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Footer */}
        <Typography variant="body2" sx={{ opacity: 0.6, mt: 4 }}>
          © 2025 Benchiban. Todos os direitos reservados.
        </Typography>
      </Box>

      {/* Lado Direito - Formulário */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f7fa',
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 3,
              backgroundColor: 'white',
              boxShadow: '0 4px 20px rgba(0, 31, 63, 0.08)',
            }}
          >
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 'bold',
                color: '#001f3f',
                mb: 1,
                textAlign: 'center',
              }}
            >
              Esqueceu a senha?
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 4,
                textAlign: 'center',
              }}
            >
              Digite seu e-mail cadastrado para receber o link de recuperação
            </Typography>

            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}
            
            {success && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {success}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} noValidate>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Endereço de E-mail"
                name="email"
                autoComplete="email"
                autoFocus
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  mt: 1,
                  mb: 3,
                  color: 'text.secondary',
                }}
              >
                Você receberá um e-mail com instruções para redefinir sua senha
              </Typography>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  mt: 2,
                  mb: 2,
                  py: 1.8,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  backgroundColor: '#001f3f',
                  '&:hover': {
                    backgroundColor: '#003d7a',
                  },
                  '&:disabled': {
                    backgroundColor: '#ccc',
                  },
                }}
              >
                {isLoading ? 'Enviando...' : 'Enviar Link de Redefinição'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Lembrou sua senha?
                </Typography>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    color: '#001f3f',
                    fontWeight: 'bold',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 31, 63, 0.05)',
                    },
                  }}
                >
                  Voltar para o Login
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default ForgotPasswordPage;
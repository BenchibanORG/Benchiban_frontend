import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Box, 
  TextField, 
  Button, 
  Alert, 
  Typography, 
  Container,
  Paper,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff, Lock } from '@mui/icons-material';
import { resetPassword } from '../services/api';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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
    if (password.length < 8) {
      setError('A senha deve ter no mínimo 8 caracteres.');
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
            Redefina sua senha
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: '1.1rem',
              lineHeight: 1.6,
              opacity: 0.9,
            }}
          >
            Crie uma nova senha segura para proteger sua conta
          </Typography>
        </Box>

        {/* Features */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Lock sx={{ fontSize: 28 }} />
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                Segurança Garantida
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                Suas informações estão protegidas
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
              Redefinir Senha
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 4,
                textAlign: 'center',
              }}
            >
              Digite sua nova senha abaixo
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
                name="password"
                label="Nova Senha"
                type={showPassword ? 'text' : 'password'}
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputProps={{ 'data-testid': 'password-input' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Nova Senha"
                type={showConfirmPassword ? 'text' : 'password'}
                variant="outlined"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                inputProps={{ 'data-testid': 'confirm-password-input' }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
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
                A senha deve ter no mínimo 8 caracteres
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
                {isLoading ? 'Salvando...' : 'Salvar Nova Senha'}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 3 }}>
                <Button
                  onClick={() => navigate('/login')}
                  sx={{
                    textTransform: 'none',
                    color: '#001f3f',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 31, 63, 0.05)',
                    },
                  }}
                >
                  Voltar para o login
                </Button>
              </Box>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default ResetPasswordPage;
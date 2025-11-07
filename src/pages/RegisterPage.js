import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Link,
  Alert,
  Container,
  Typography,
  InputAdornment,
  IconButton,
  Paper,
  CircularProgress
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../services/api';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

    setIsLoading(true);

    try {
      await registerUser(email, password);
      setSuccess('Cadastro realizado com sucesso! Redirecionando para o login...');
      
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #f1f5f9 100%)',
      }}
    >
      {/* Painel Esquerdo - Branding (Desktop) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '50%',
          background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
          p: 6,
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Elementos decorativos */}
        <Box
          sx={{
            position: 'absolute',
            top: -150,
            right: -150,
            width: 400,
            height: 400,
            borderRadius: '50%',
            bgcolor: 'white',
            opacity: 0.05,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -100,
            left: -100,
            width: 300,
            height: 300,
            borderRadius: '50%',
            bgcolor: 'white',
            opacity: 0.05,
          }}
        />

        {/* Conteúdo do painel */}
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <Box
              component="img"
              src={benchibanLogo}
              alt="Benchiban Logo"
              sx={{
                height: 100,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                filter: 'brightness(0) invert(1)',
              }}
            />
          </Box>

          <Box sx={{ mt: 8 }}>
            <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 2, lineHeight: 1.3 }}>
              Encontre as melhores<br />ofertas de GPUs
            </Typography>
            <Typography variant="body1" sx={{ color: '#bfdbfe', fontSize: '1.1rem', lineHeight: 1.7 }}>
              Compare preços em tempo real de placas de vídeo de alto desempenho
              para Inteligência Artificial nos principais marketplaces globais.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                p: 1,
                borderRadius: 1.5,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>📉</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                Economia Garantida
              </Typography>
              <Typography variant="body2" sx={{ color: '#bfdbfe' }}>
                Compare preços de eBay, Amazon e outros marketplaces
              </Typography>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Box
              sx={{
                bgcolor: 'rgba(255, 255, 255, 0.1)',
                p: 1,
                borderRadius: 1.5,
                backdropFilter: 'blur(10px)',
              }}
            >
              <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>⚡</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600, mb: 0.5 }}>
                Conversão em Tempo Real
              </Typography>
              <Typography variant="body2" sx={{ color: '#bfdbfe' }}>
                Todos os valores convertidos automaticamente para BRL
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Painel Direito - Formulário */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 4,
        }}
      >
        <Container maxWidth="sm">
          {/* Logo Mobile */}
          <Box
            sx={{
              display: { xs: 'flex', lg: 'none' },
              alignItems: 'center',
              justifyContent: 'center',
              mb: 4,
            }}
          >
            <Box
              component="img"
              src={benchibanLogo}
              alt="Benchiban Logo"
              sx={{
                height: 50,
                width: 'auto',
              }}
            />
          </Box>

          <Paper
            elevation={24}
            sx={{
              p: 5,
              borderRadius: 4,
              border: '1px solid',
              borderColor: 'grey.200',
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" sx={{ color: '#001f3f', fontWeight: 'bold', mb: 1 }}>
                Crie sua conta
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Preencha os dados abaixo para começar
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

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

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                >
                  Senha
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
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

              <Box sx={{ mb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
                >
                  Confirmar Senha
                </Typography>
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
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
                {isLoading ? <CircularProgress size={24} color="inherit" /> : 'CRIAR CONTA'}
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
                <Typography variant="body2" color="text.secondary">
                  Já tem uma conta?{' '}
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
                    Faça o login
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            © 2025 Benchiban. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default RegisterPage;
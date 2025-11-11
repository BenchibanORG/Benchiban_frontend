import React, { useState } from 'react';
import { Box, TextField, Button, Alert, Link, Typography, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import AuthPageLayout from '../components/AuthPageLayout';
import { resetPassword } from '../services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!password || !confirmPassword) {
      setAlert({ type: 'error', message: 'Por favor, preencha todos os campos.' });
      return;
    }

    if (password !== confirmPassword) {
      setAlert({ type: 'error', message: 'As senhas não coincidem!' });
      return;
    }

    if (password.length < 8) {
      setAlert({ type: 'error', message: 'A senha deve ter no mínimo 8 caracteres.' });
      return;
    }

    const token = new URLSearchParams(location.search).get('token');
    if (!token) {
      setAlert({
        type: 'error',
        message: 'Token de redefinição ausente ou inválido. Por favor, solicite um novo link.'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setAlert({ type: '', message: '' });

      const response = await resetPassword(token, password);

      setAlert({ type: 'success', message: response.message });
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      const errorMsg =
        error?.response?.data?.detail ||
        'Erro ao redefinir a senha. Por favor, tente novamente.';
      setAlert({ type: 'error', message: errorMsg });
      setIsSubmitting(false);
    }
  };

  return (
    <AuthPageLayout title="Redefinir Senha">
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
          A senha deve ter no mínimo 8 caracteres
        </Typography>

        {alert.message && (
          <Alert severity={alert.type} role="alert" sx={{ mb: 2 }}>
            {alert.message}
          </Alert>
        )}

        <TextField
          required
          fullWidth
          name="password"
          type={showPassword ? 'text' : 'password'}
          id="password"
          placeholder="••••••••"
          label="Nova Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          inputProps={{ 'data-testid': 'password-input' }}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          required
          fullWidth
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          id="confirmPassword"
          placeholder="••••••••"
          label="Confirmar Nova Senha"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          inputProps={{ 'data-testid': 'confirm-password-input' }}
          margin="normal"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 3, mb: 2 }}
        >
          {isSubmitting ? 'Salvando...' : 'Salvar Nova Senha'}
        </Button>

        <Button
          fullWidth
          variant="outlined"
          color="secondary"
          onClick={() => navigate('/login')}
        >
          Voltar para o login
        </Button>

        <Box mt={2} textAlign="center">
          <Link component={RouterLink} to="/login" variant="body2">
            Voltar ao login
          </Link>
        </Box>
      </Box>
    </AuthPageLayout>
  );
};

export default ResetPasswordPage;
// src/components/AuthFormWrapper.js
import React from 'react';
import { Box, Button, Alert, Typography, CircularProgress } from '@mui/material';

function AuthFormWrapper({ 
  onSubmit, 
  buttonText, 
  isLoading, 
  error, 
  success,
  warning,
  children, 
  bottomLink,
  links
}) {
  return (
    <Box component="form" onSubmit={onSubmit} noValidate>
      {/* Alertas de Aviso (Warning) */}
      {typeof warning === 'string' && warning.trim() !== '' ? (
        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
          {warning}
        </Alert>
      ) : null}

      {/* Alertas de Erro e Sucesso */}
      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      {children}

      {links && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          {links}
        </Box>
      )}

      {/* Botão Principal de Submissão */}
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
        {isLoading ? <CircularProgress size={24} color="inherit" /> : buttonText}
      </Button>

      {/* Divisor "ou" */}
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

      {/* Link Inferior Centralizado */}
      {bottomLink && (
        <Box sx={{ textAlign: 'center' }}>
          {bottomLink}
        </Box>
      )}
    </Box>
  );
}

export default AuthFormWrapper;
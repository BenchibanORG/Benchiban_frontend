// src/components/AuthPageLayout.js
import React from 'react';
import { Box, Container, Typography, Paper } from '@mui/material';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function AuthPageLayout({ 
  title, 
  subtitle, 
  children, 
  footerText = "© 2025 Benchiban. Todos os direitos reservados." 
}) {
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
        {/* ... resto do código ... */}
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
                {title}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {subtitle}
              </Typography>
            </Box>

            {children}
          </Paper>

          <Typography
            variant="body2"
            align="center"
            color="text.secondary"
            sx={{ mt: 4 }}
          >
            {footerText}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default AuthPageLayout;
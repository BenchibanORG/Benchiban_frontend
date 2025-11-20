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
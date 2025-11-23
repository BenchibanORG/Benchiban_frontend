// src/components/HeroSection.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

function HeroSection({ 
  title = "Encontre as Melhores Ofertas",
  subtitle = "Compare preços em tempo real de placas de vídeo de alto desempenho",
  description = "Pesquisamos em eBay, Amazon e outros marketplaces globais para trazer o melhor preço em Real (BRL)"
}) {
  return (
    <Box
      sx={{
        background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <TrendingUp sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
        <Typography
          variant="h2"
          fontWeight="bold"
          sx={{
            mb: 2,
            fontFamily: "'Noto Sans JP', sans-serif",
          }}
        >
          {title}
        </Typography>
        <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
          {subtitle}
        </Typography>
        
        {/* Aumentei o maxWidth de 700 para 900 para evitar a quebra de linha */}
        <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 900, mx: 'auto' }}>
          {description}
        </Typography>
      </Container>
    </Box>
  );
}

export default HeroSection;
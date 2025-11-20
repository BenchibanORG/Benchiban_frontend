import React from 'react';
import { Card, Typography, Button, Box } from '@mui/material';

function ResultCard({ site, country, price, link, isBestPrice = false }) {
  return (
    <Card
      variant="outlined"
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        p: 4,
        borderColor: isBestPrice ? 'primary.main' : 'grey.300',
        boxShadow: isBestPrice ? 3 : 1,
        borderWidth: isBestPrice ? 2 : 1,
        borderStyle: 'solid',
        width: isBestPrice ? '100%' : 360, // 🔹 Mantém o tamanho total do card principal
        maxWidth: isBestPrice ? '1100px' : 'auto', // 🔹 Controla largura máxima visual
        mx: 'auto',
        textAlign: isBestPrice ? 'left' : 'center',
      }}
    >
      {/* Conteúdo do card (lado esquerdo) */}
      <Box sx={{ flex: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            color: 'primary.main',
            mb: 0.5,
          }}
        >
          {site}
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {country || 'País não informado'}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 'bold',
            mt: 1,
          }}
        >
          {price ? `R$ ${price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}` : 'Preço indisponível'}
        </Typography>
      </Box>

      {/* Botão (lado direito) */}
      <Button
        variant="contained"
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          ml: 3,
          px: 3,
          py: 1.4,
          fontWeight: 'bold',
          textTransform: 'none',
          bgcolor: isBestPrice ? 'primary.main' : 'grey.700',
          '&:hover': {
            bgcolor: isBestPrice ? 'primary.dark' : 'grey.800',
          },
        }}
      >
        {isBestPrice ? 'Ver na Loja' : 'Ver Oferta'}
      </Button>
    </Card>
  );
}

export default ResultCard;

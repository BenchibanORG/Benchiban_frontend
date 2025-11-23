import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';

function GpuCard({ name, description, image, onClick, sx }) {
  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: 'auto',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        // Estas propriedades permitem que o card responda ao layout flex do pai
        display: 'flex',
        flexDirection: 'column',
        ...sx, 
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{
          // Garante que a área clicável ocupe todo o card
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start', // Alinha itens no topo
          alignItems: 'stretch'
        }}
      >
        <CardMedia
          component="img"
          height="260"
          image={image}
          alt={name}
          sx={{
            objectFit: 'contain',
            p: 2,
            backgroundColor: '#fff', // Corrigido hex (tinha ffffff a mais)
          }}
        />
        
        {/* flexGrow: 1 faz este conteúdo esticar para preencher o espaço vazio */}
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ textAlign: 'center', color: '#001f3f' }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'justify',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GpuCard;
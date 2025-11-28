import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Box } from '@mui/material';

// Adicionei 'techInfo' aqui na lista de props recebidas
function GpuCard({ name, description, techInfo, image, onClick, sx }) {
  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: 'auto',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        ...sx, 
      }}
    >
      <CardActionArea 
        onClick={onClick}
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
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
            backgroundColor: '#fff',
          }}
        />
        
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
              mb: 2, // Espaço extra antes da info técnica
            }}
          >
            {description}
          </Typography>

          {/* NOVA ÁREA: Tech Info */}
          {techInfo && (
            <Box sx={{ 
              mt: 'auto', // Empurra para o final se sobrar espaço
              p: 1.5, 
              backgroundColor: '#f8f9fa', 
              borderRadius: 2,
              border: '1px solid #e0e0e0'
            }}>
              <Typography 
                variant="caption" 
                display="block" 
                sx={{ 
                  color: '#555', 
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  lineHeight: 1.4
                }}
              >
                <strong>Specs:</strong> {techInfo}
              </Typography>
            </Box>
          )}

        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GpuCard;
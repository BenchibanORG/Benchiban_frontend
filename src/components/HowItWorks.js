import React from 'react';
import { Box, Typography, Grid, Alert } from '@mui/material';

const steps = [
  {
    number: 1,
    title: 'Selecione',
    description: 'Escolha a placa de vídeo que deseja pesquisar'
  },
  {
    number: 2,
    title: 'Compare',
    description: 'Veja preços em diferentes marketplaces globais'
  },
  {
    number: 3,
    title: 'Economize',
    description: 'Encontre a melhor oferta convertida para BRL'
  }
];

function HowItWorks() {
  return (
    <Box
      sx={{
        mt: 8,
        p: 4,
        backgroundColor: 'white',
        borderRadius: 3,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#001f3f', mb: 2 }}>
        Como Funciona?
      </Typography>
      
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {steps.map((step) => (
          <Grid item xs={12} md={4} key={step.number}>
            <Box>
              <Typography variant="h4" sx={{ color: '#001f3f', mb: 1 }}>
                {step.number}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {step.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {step.description}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Novo Aviso ao Usuário - Centralizado Corretamente */}
      <Box sx={{ 
        mt: 5, 
        // Define a largura como 95% do espaço disponível em telas médias/grandes
        // e 100% em telas pequenas (celulares)
        width: { xs: '100%', md: '95%' }, 
        // Margem automática no eixo X (horizontal) centraliza o elemento
        mx: 'auto' 
      }}>
        <Alert severity="warning" variant="outlined" sx={{ textAlign: 'left', border: '1px solid #ed6c02' }}>
          <Typography variant="body2" color="text.primary">
            <strong>Aviso Importante:</strong> O Benchiban busca automaticamente os melhores preços e avaliações disponíveis, 
            mas <strong>não possui parceria com as lojas listadas</strong>. Recomendamos que você sempre analise cuidadosamente o anúncio 
            e a reputação do vendedor na plataforma de origem para garantir que a oferta é genuína antes de realizar a compra.
          </Typography>
        </Alert>
      </Box>
    </Box>
  );
}

export default HowItWorks;
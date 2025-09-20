import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import GpuCard from '../components/GpuCard';

// Dados temporários para as placas de vídeo
const gpuData = [
  {
    name: 'GPU Modelo X',
    description: 'Ideal para modelos de linguagem de grande escala e processamento intensivo.',
    image: 'https://via.placeholder.com/300x200.png?text=GPU+Image'
  },
  {
    name: 'GPU Modelo Y',
    description: 'Ótimo custo-benefício para treinamento de redes neurais e inferência.',
    image: 'https://via.placeholder.com/300x200.png?text=GPU+Image'
  },
  {
    name: 'GPU Modelo Z',
    description: 'Performance de ponta para computação gráfica e aplicações de IA visual.',
    image: 'https://via.placeholder.com/300x200.png?text=GPU+Image'
  }
];

function DashboardPage() {
  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho / Seção Hero */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            sx={{ color: '#001f3f' }} // Tom de azul marinho
          >
            Benchiban
          </Typography>
          <Typography variant="h6" color="text.secondary">
            O melhor preço de GPU em primeiro lugar!
          </Typography>
        </Box>

        {/* Grade de Placas de Vídeo */}
        <Grid container spacing={4} justifyContent="center">
          {gpuData.map((gpu, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <GpuCard
                name={gpu.name}
                description={gpu.description}
                image={gpu.image}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GpuCard from '../components/GpuCard';

const gpuData = [
  {
    name: 'NVIDIA RTX 4090',
    description: 'Ideal para modelos de linguagem de grande escala e processamento intensivo.',
    image: 'https://picsum.photos/seed/rtx4090/300/200'
  },
  {
    name: 'AMD RX 7900 XTX',
    description: 'Ótimo custo-benefício para treinamento de redes neurais e inferência.',
    image: 'https://picsum.photos/seed/rx7900/300/200'
  },
  {
    name: 'NVIDIA RTX 4080',
    description: 'Performance de ponta para computação gráfica e aplicações de IA visual.',
    image: 'https://picsum.photos/seed/rtx4080/300/200'
  }
];

function DashboardPage() {
  const navigate = useNavigate();

  const handleCardClick = (gpuName) => {
    console.log(`Buscando preços para: ${gpuName}`);
    navigate('/results');
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Cabeçalho / Seção Hero */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            sx={{ 
              color: '#001f3f'
            }}
          >
            Benchiban
          </Typography>
          <Typography variant="h6" color="text.secondary">
            O melhor preço de GPU em primeiro lugar!
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {gpuData.map((gpu, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <div onClick={() => handleCardClick(gpu.name)} style={{ cursor: 'pointer' }}>
                <GpuCard
                  name={gpu.name}
                  description={gpu.description}
                  image={gpu.image}
                />
              </div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
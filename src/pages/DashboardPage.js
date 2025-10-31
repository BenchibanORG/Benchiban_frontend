import React, { useState } from 'react';
import { Box, Container, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GpuCard from '../components/GpuCard';
import { getProductComparison } from '../services/api';
import imgRtx5090 from '../assets/images/rtx5090.jpg';
import imgRtxA6000 from '../assets/images/rtxa6000.jpg';
import imgW7900 from '../assets/images/amdw7900.jpg';

const gpuData = [
  {
    name: 'NVIDIA RTX 5090 32GB',
    description:
      'A NVIDIA RTX 5090 de 32GB é uma das placas mais poderosas da atualidade, voltada tanto para gamers exigentes quanto para entusiastas de inteligência artificial. Seu grande destaque é a velocidade impressionante e a nova geração de memória GDDR7, que garante alto desempenho em treinos de IA e renderizações pesadas. Ideal para quem busca performance extrema em um computador pessoal, sem precisar investir em placas de uso corporativo.',
    image: imgRtx5090,
  },
  {
    name: 'NVIDIA RTX A6000 48GB',
    description:
      'A NVIDIA RTX A6000 de 48GB é uma placa voltada para profissionais que trabalham com projetos pesados e contínuos, como treinar modelos de IA avançados, renderizações 3D e simulações científicas. Sua principal vantagem é a estabilidade, funcionando por longos períodos sem perda de desempenho. Indicada para ambientes Linux e uso profissional intenso.',
    image: imgRtxA6000,
  },
  {
    name: 'AMD Radeon PRO W7900 48GB',
    description:
      'A AMD Radeon PRO W7900 de 48GB se destaca pelo excelente custo-benefício entre as placas profissionais. Oferece a mesma quantidade de VRAM da A6000, mas com preço mais acessível. Ideal para pesquisadores e profissionais que precisam de estabilidade e eficiência energética em grandes cargas de trabalho.',
    image: imgW7900,
  },
];

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCardClick = async (gpuName) => {
    setIsLoading(true);
    setError('');
    try {
      const comparisonData = await getProductComparison(gpuName);
      navigate('/results', { state: { data: comparisonData, query: gpuName } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || `Não foi possível buscar ofertas para ${gpuName}.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ backgroundColor: '#ffffffff', minHeight: '100vh' }}>
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: '#001f3f',
              fontFamily: "'Noto Sans JP', sans-serif",
              mb: 1,
            }}
          >
            Benchiban
          </Typography>
          <Typography variant="h6" color="text.secondary">
            O melhor preço de GPU em primeiro lugar!
          </Typography>
        </Box>

        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Grid container spacing={6} justifyContent="center">
          {gpuData.map((gpu, index) => (
            <Grid item key={index} xs={12} sm={6} md={6} lg={4}>
              <GpuCard
                name={gpu.name}
                description={gpu.description}
                image={gpu.image}
                onClick={() => !isLoading && handleCardClick(gpu.name)}
                sx={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0px 6px 18px rgba(0,0,0,0.15)',
                  },
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
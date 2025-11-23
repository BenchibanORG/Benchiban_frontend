// src/pages/DashboardPage.js
import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GpuCard from '../components/GpuCard';
import AppHeader from '../components/AppHeader';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import AppFooter from '../components/AppFooter';
import { getProductComparison } from '../services/api';
import imgRtx5090 from '../assets/images/rtx5090.jpg';
import imgRtxA6000 from '../assets/images/rtxa6000.jpg';
import imgW7900 from '../assets/images/amdw7900.jpg';

const gpuData = [
  {
    name: 'NVIDIA RTX 5090 32GB',
    description:
      'A NVIDIA RTX 5090 de 32GB é uma das placas mais poderosas da atualidade, voltada tanto para gamers exigentes quanto para entusiastas de inteligência artificial. Seu grande destaque é a velocidade impressionante e a nova geração de memória GDDR7, que garante alto desempenho em treinos de IA e renderizações pesadas.',
    image: imgRtx5090,
    tag: 'Para Entusiastas',
    tagColor: '#ff9800',
  },
  {
    name: 'NVIDIA RTX A6000 48GB',
    description:
      'A NVIDIA RTX A6000 de 48GB é uma placa voltada para profissionais que trabalham com projetos pesados e contínuos, como treinar modelos de IA avançados, renderizações 3D e simulações científicas. Sua principal vantagem é a estabilidade, funcionando por longos períodos sem perda de desempenho.',
    image: imgRtxA6000,
    tag: 'Profissional',
    tagColor: '#2196f3',
  },
  {
    name: 'AMD Radeon PRO W7900 48GB',
    description:
      'A AMD Radeon PRO W7900 de 48GB se destaca pelo excelente custo-benefício entre as placas profissionais. Oferece a mesma quantidade de VRAM da A6000, mas com preço mais acessível. Ideal para pesquisadores e profissionais que precisam de estabilidade e eficiência energética em grandes cargas de trabalho.',
    image: imgW7900,
    tag: 'Melhor Custo-Benefício',
    tagColor: '#00c853',
  },
];

function DashboardPage() {
  console.log('Dashboard carregando...');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingGpu, setLoadingGpu] = useState(null);

  const handleCardClick = async (gpuName) => {
    setIsLoading(true);
    setLoadingGpu(gpuName);
    setError('');
    
    try {
      const comparisonData = await getProductComparison(gpuName);
      navigate('/results', { state: { data: comparisonData, query: gpuName } });
    } catch (err) {
      const errorMessage =
        err.response?.data?.detail || `Não foi possível buscar ofertas para ${gpuName}. Tente novamente.`;
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setLoadingGpu(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppHeader />
      
      <HeroSection />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Feedback de Loading */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, my: 4 }}>
            <CircularProgress size={30} />
            <Typography variant="body1" color="text.secondary">
              Buscando as melhores ofertas para {loadingGpu}...
            </Typography>
          </Box>
        )}
        
        {/* Feedback de Erro */}
        {error && (
          <Alert 
            severity="error" 
            onClose={() => setError('')}
            sx={{ 
              my: 3,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {/* Título da Seção */}
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: '#001f3f', mb: 1 }}
          >
            Selecione uma Placa de Vídeo
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Clique em um card para ver comparação de preços
          </Typography>
        </Box>

        {/* Grid de Cards */}
        <Grid container spacing={4} justifyContent="center" alignItems="stretch"> {/* alignItems="stretch" garante altura igual na linha */}
          {gpuData.map((gpu, index) => (
            <Grid 
              item 
              key={index} 
              xs={12} 
              sm={6} 
              lg={4} 
              sx={{ display: 'flex' }}
            >
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',          
                  display: 'flex',        
                  flexDirection: 'column'
                }}
              >
                {/* Tag de Destaque */}
                <Chip
                  label={gpu.tag}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 10,
                    backgroundColor: gpu.tagColor,
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.75rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  }}
                />
                
                <GpuCard
                  name={gpu.name}
                  description={gpu.description}
                  image={gpu.image}
                  onClick={() => !isLoading && handleCardClick(gpu.name)}
                  isLoading={loadingGpu === gpu.name}
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    cursor: isLoading ? 'wait' : 'pointer',
                    opacity: isLoading && loadingGpu !== gpu.name ? 0.5 : 1,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: isLoading ? 'none' : 'translateY(-8px)',
                      boxShadow: isLoading ? 'none' : '0px 12px 24px rgba(0, 31, 63, 0.15)',
                    },
                  }}
                />
              </Box>
            </Grid>
          ))}
        </Grid>

        <HowItWorks />
      </Container>

      <AppFooter />
    </Box>
  );
}

export default DashboardPage;
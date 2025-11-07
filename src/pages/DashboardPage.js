import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert,
  AppBar,
  Toolbar,
  Button,
  Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Logout, TrendingUp } from '@mui/icons-material';
import GpuCard from '../components/GpuCard';
import { getProductComparison } from '../services/api';
import imgRtx5090 from '../assets/images/rtx5090.jpg';
import imgRtxA6000 from '../assets/images/rtxa6000.jpg';
import imgW7900 from '../assets/images/amdw7900.jpg';
import benchibanLogo from '../assets/images/benchibanlogo.png';

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Header/AppBar */}
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              component="img"
              src={benchibanLogo}
              alt="Benchiban Logo"
              sx={{
                height: 70,
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <Typography
              variant="h5"
              sx={{
                fontWeight: 'bold',
                color: '#001f3f',
                letterSpacing: '0.05em',
              }}
            >
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              borderColor: '#001f3f',
              color: '#001f3f',
              '&:hover': {
                borderColor: '#003d7a',
                backgroundColor: 'rgba(0, 31, 63, 0.05)',
              },
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section */}
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
            Encontre as Melhores Ofertas
          </Typography>
          <Typography variant="h5" sx={{ opacity: 0.9, mb: 1 }}>
            Compare preços em tempo real de placas de vídeo de alto desempenho
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.8, maxWidth: 700, mx: 'auto' }}>
            Pesquisamos em eBay, Amazon e outros marketplaces globais para trazer o melhor preço em Real (BRL)
          </Typography>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        {/* Feedback de Loading/Erro */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, my: 4 }}>
            <CircularProgress size={30} />
            <Typography variant="body1" color="text.secondary">
              Buscando as melhores ofertas para {loadingGpu}...
            </Typography>
          </Box>
        )}
        
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
        <Grid container spacing={4} justifyContent="center">
          {gpuData.map((gpu, index) => (
            <Grid item key={index} xs={12} sm={6} lg={4}>
              <Box sx={{ position: 'relative' }}>
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

        {/* Informações Adicionais */}
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
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h4" sx={{ color: '#001f3f', mb: 1 }}>1</Typography>
                <Typography variant="subtitle1" fontWeight="bold">Selecione</Typography>
                <Typography variant="body2" color="text.secondary">
                  Escolha a placa de vídeo que deseja pesquisar
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h4" sx={{ color: '#001f3f', mb: 1 }}>2</Typography>
                <Typography variant="subtitle1" fontWeight="bold">Compare</Typography>
                <Typography variant="body2" color="text.secondary">
                  Veja preços em diferentes marketplaces globais
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="h4" sx={{ color: '#001f3f', mb: 1 }}>3</Typography>
                <Typography variant="subtitle1" fontWeight="bold">Economize</Typography>
                <Typography variant="body2" color="text.secondary">
                  Encontre a melhor oferta convertida para BRL
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          backgroundColor: '#001f3f',
          color: 'white',
          py: 4,
          mt: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            © 2025 Benchiban. Todos os direitos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default DashboardPage;
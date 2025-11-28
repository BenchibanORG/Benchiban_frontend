// src/pages/DashboardPage.js
import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  CircularProgress, 
  Alert,
  Chip,
  TextField,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GpuCard from '../components/GpuCard';
import AppHeader from '../components/AppHeader';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import AppFooter from '../components/AppFooter';
import { getProductComparison } from '../services/api';

// --- IMPORTS DE IMAGENS ---
import imgRtx5090 from '../assets/images/rtx5090.jpg';
import imgRtxA6000 from '../assets/images/rtxa6000.jpg';
import imgW7900 from '../assets/images/amdw7900.jpg';
import imgRx7600xt from '../assets/images/amdrx7600xt.png';
import imgRx7900xt from '../assets/images/amdrx7900xt.png';
import imgRx7900xtx from '../assets/images/amdrx7900xtx.png';
import imgArcA770 from '../assets/images/intelarca770.png';
import imgRtx4070ti from '../assets/images/rtx4070tisuper.png';
import imgRtx4080super from '../assets/images/rtx4080super.png';
import imgRtx6000Ada from '../assets/images/rtx6000ada.png';

// --- DADOS DAS GPUS (MOCKED DATA) ---
const ALL_GPUS = [
// # Profissionais (48GB - 32GB)
  {
    id: 'rtx-a6000',
    name: 'NVIDIA RTX A6000 48GB',
    brand: 'NVIDIA',
    category: 'Profissional',
    vram: '48GB',
    vramValue: 48, 
    image: imgRtxA6000,
    description: '48GB de VRAM lendária para devorar LLMs gigantes sem piscar.',
    techInfo: 'Arquitetura Ampere com 10.752 CUDA Cores e 336 Tensor Cores para acelerações rápidas em redes neurais.',
  },
  {
    id: 'rtx-6000-ada',
    name: 'NVIDIA RTX 6000 Ada 48GB',
    brand: 'NVIDIA',
    category: 'Profissional',
    vram: '48GB',
    vramValue: 48,
    image: imgRtx6000Ada,
    description: '48GB Ada com esteroides: velocidade brutal + ECC profissional.',
    techInfo: 'Ada Lovelace com 18.176 CUDA Cores e 568 Tensor Cores de 4ª geração para treinamentos de IA ultraeficientes.',
  },
  {
    id: 'pro-w7900',
    name: 'AMD Radeon PRO W7900 48GB',
    brand: 'AMD',
    category: 'Profissional',
    vram: '48GB',
    vramValue: 48,
    image: imgW7900,
    description: '48GB de poder ROCm puro para dominar IA open-source.',
    techInfo: 'RDNA 3 com 6.144 Stream Processors e 96 Compute Units para computação paralela massiva em projetos colaborativos.',
  },
  {
    id: 'rtx-5090',
    name: 'NVIDIA RTX 5090 32GB',
    brand: 'NVIDIA',
    category: 'Profissional',
    vram: '32GB',
    vramValue: 32,
    image: imgRtx5090,
    description: 'O trono do single-GPU: 32GB voando em FP4 e Blackwell bruto.',
    techInfo: 'Blackwell com 21.760 CUDA Cores e 680 Tensor Cores de 5ª geração para inferências de IA em velocidade recorde.',
  },
// # Intermediárias (24GB - 16GB High End)
  {
    id: 'rx-7900-xtx',
    name: 'AMD Radeon RX 7900 XTX 24GB',
    brand: 'AMD',
    category: 'Intermediária',
    vram: '24GB',
    vramValue: 24,
    image: imgRx7900xtx,
    description: '24GB de fúria RDNA 3 que devora fine-tuning dia e noite.',
    techInfo: 'RDNA 3 com 6.144 Stream Processors e 192 Tensor Cores para acelerações em tarefas de aprendizado profundo.',
  },
  {
    id: 'rx-7900-xt',
    name: 'AMD Radeon RX 7900 XT 20GB',
    brand: 'AMD',
    category: 'Iniciante',
    vram: '20GB',
    vramValue: 20,
    image: imgRx7900xt,
    description: '20GB de músculo AMD para treinar modelos pesados sem medo.',
    techInfo: 'RDNA 3 com 5.376 Stream Processors e 168 Tensor Cores para processamento paralelo acessível e potente.',
  },
  {
    id: 'rtx-4070-ti-super',
    name: 'NVIDIA RTX 4070 Ti SUPER 16GB',
    brand: 'NVIDIA',
    category: 'Intermediária',
    vram: '16GB',
    vramValue: 16,
    image: imgRtx4070ti,
    description: '16GB Ada turbinada que acelera IA com eficiência impressionante.',
    techInfo: 'Ada Lovelace com 8.448 CUDA Cores e 264 Tensor Cores para otimizações rápidas em modelos de visão.',
  },
  {
    id: 'rtx-4080-super',
    name: 'NVIDIA RTX 4080 Super 16GB',
    brand: 'NVIDIA',
    category: 'Intermediária',
    vram: '16GB',
    vramValue: 16,
    image: imgRtx4080super,
    description: '16GB Ada que torna geração de imagens e treinamento de modelos mais rápidos.',
    techInfo: 'Ada Lovelace com 10.240 CUDA Cores e 320 Tensor Cores para acelerações inteligentes em criações visuais.',
  },
// # Iniciantes (16GB Entry)
  {
    id: 'rx-7600-xt',
    name: 'AMD Radeon RX 7600 XT 16GB',
    brand: 'AMD',
    category: 'Iniciante',
    vram: '16GB',
    vramValue: 16,
    image: imgRx7600xt,
    description: '16GB RDNA 3 que converte qualquer PC em um laboratório de treinamento de IA.',
    techInfo: 'RDNA 3 com 2.048 Stream Processors e 64 Tensor Cores para experimentos iniciais com dados massivos.',
  },
  {
    id: 'arc-a770',
    name: 'Intel Arc A770 16GB',
    brand: 'Intel',
    category: 'Iniciante',
    vram: '16GB',
    vramValue: 16,
    image: imgArcA770,
    description: 'O azarão de 16GB que surpreende em treinamento e criação.',
    techInfo: 'Xe HPG com 32 Xe Cores e 512 XMX Engines para acelerações surpreendentes em tarefas de aprendizado.',
  },
];

// Opções para os Filtros
const CATEGORIES = ['Todas', 'Profissional', 'Intermediária', 'Iniciante'];
const BRANDS = ['Todas', 'NVIDIA', 'AMD', 'Intel'];
const VRAMS = ['Todas', '48GB', '32GB', '24GB', '20GB', '16GB'];

function DashboardPage() {
  const navigate = useNavigate();
  
  // Estados de API e UI
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [loadingGpu, setLoadingGpu] = useState(null);

  // Estados dos Filtros
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [filterBrand, setFilterBrand] = useState('Todas');
  const [filterVram, setFilterVram] = useState('Todas');

  // Lógica de Filtragem
  const filteredGpus = useMemo(() => {
    return ALL_GPUS.filter((gpu) => {
      const matchCategory = filterCategory === 'Todas' || gpu.category === filterCategory;
      const matchBrand = filterBrand === 'Todas' || gpu.brand === filterBrand;
      const matchVram = filterVram === 'Todas' || gpu.vram === filterVram;
      
      return matchCategory && matchBrand && matchVram;
    });
  }, [filterCategory, filterBrand, filterVram]);

  // Handler de clique
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

  // Cores das tags baseadas na Categoria
  const getTagColor = (category) => {
    switch(category) {
      case 'Profissional': return '#6A1B9A'; // Roxo Escuro
      case 'Intermediária': return '#FF5722'; // Laranja Escuro
      case 'Iniciante': return '#00c5dbff'; // Ciano Neon
      default: return '#757575';
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppHeader />
      <HeroSection />

      <Container maxWidth="xl" sx={{ py: 6 }}>
        
        {/* Loading Global Feedback */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, my: 4 }}>
            <CircularProgress size={30} />
            <Typography variant="body1" color="text.secondary">
              Buscando as melhores ofertas para {loadingGpu}...
            </Typography>
          </Box>
        )}
        
        {/* Error Feedback */}
        {error && (
          <Alert severity="error" onClose={() => setError('')} sx={{ my: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Título */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#001f3f', mb: 1 }}>
            Escolha sua GPU
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Filtre pelas especificações ideais para o seu projeto de IA
          </Typography>
        </Box>

        {/* --- ÁREA DE FILTROS --- */}
        <Box 
          sx={{ 
            mb: 5, 
            p: 3, 
            backgroundColor: '#fff', 
            borderRadius: 3, 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)' 
          }}
        >
          <Grid container spacing={2} alignItems="center" justifyContent="center">
             {/* Filtro Categoria */}
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                label="Categoria"
                fullWidth
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                size="small"
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              >
                {CATEGORIES.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtro Marca */}
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                label="Marca"
                fullWidth
                value={filterBrand}
                onChange={(e) => setFilterBrand(e.target.value)}
                size="small"
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              >
                {BRANDS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Filtro VRAM */}
            <Grid item xs={12} sm={4} md={3}>
              <TextField
                select
                label="Quantidade de VRAM"
                fullWidth
                value={filterVram}
                onChange={(e) => setFilterVram(e.target.value)}
                size="small"
                SelectProps={{
                  MenuProps: {
                    disableScrollLock: true,
                  },
                }}
              >
                {VRAMS.map((option) => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Box>

        {/* --- GRID DE CARDS --- */}
        <Grid container spacing={4} justifyContent="flex-start" alignItems="stretch">
          {filteredGpus.length > 0 ? (
            filteredGpus.map((gpu) => (
              <Grid 
                item 
                key={gpu.id} 
                xs={12}     // Mobile: 1 por linha
                sm={6}      // Tablet: 2 por linha
                md={4}      // Desktop: 3 por linha (Gera o layout 3-3-3-1 para 10 itens)
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
                  {/* Tag baseada na Categoria */}
                  <Chip
                    label={gpu.category}
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 10,
                      backgroundColor: getTagColor(gpu.category),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  />
                  
                  <GpuCard
                    name={gpu.name}
                    description={gpu.description}
                    techInfo={gpu.techInfo} // <--- ADICIONADO AQUI
                    image={gpu.image}
                    onClick={() => !isLoading && handleCardClick(gpu.name)}
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
            ))
          ) : (
            <Grid item xs={12}>
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">
                  Nenhuma placa encontrada com esses filtros.
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>

        <HowItWorks />
      </Container>
      <AppFooter />
    </Box>
  );
}

export default DashboardPage;
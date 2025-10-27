import React, { useState } from 'react'; // Adiciona useState
import { Box, Container, Typography, Grid, CircularProgress, Alert } from '@mui/material'; // Adiciona CircularProgress e Alert
import { useNavigate } from 'react-router-dom';
import GpuCard from '../components/GpuCard';
import { getProductComparison } from '../services/api';

// Dados temporários para as placas de vídeo
const gpuData = [
  {
    name: 'NVIDIA GeForce RTX 5090 32GB',
    description: 'Ideal para laboratórios de pesquisa, universidades e empresas de alto desempenho.',
    image: 'https://picsum.photos/seed/rtx4090/300/200'
  },
  {
    name: 'NVIDIA RTX A6000 48GB',
    description: 'Desenvolvida para operações contínuas e ambientes de workstation, mantendo alto desempenho por longos períodos.',
    image: 'https://picsum.photos/seed/rx7900/300/200'
  },
  {
    name: 'NVIDIA Tesla A100 80GB GPU SXM4',
    description: 'Performance de ponta para computação gráfica e aplicações de IA visual.',
    image: 'https://picsum.photos/seed/rtx4080/300/200'
  }
];

function DashboardPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const [error, setError] = useState(''); // Estado de erro

  const handleCardClick = async (gpuName) => {
    setIsLoading(true); // Inicia o carregamento
    setError(''); // Limpa erros anteriores
    console.log(`Buscando preços para: ${gpuName}`);
    
    try {
      // Chama a função da API com o nome da GPU clicada
      const comparisonData = await getProductComparison(gpuName);
      
      // Navega para a página de resultados, passando os dados via state
      // e também o nome da GPU para exibir como título
      navigate('/results', { state: { data: comparisonData, query: gpuName } });

    } catch (err) {
      const errorMessage = err.response?.data?.detail || `Não foi possível buscar ofertas para ${gpuName}. Tente novamente.`;
      setError(errorMessage);
      console.error("Erro na busca comparativa:", err);
    } finally {
      setIsLoading(false); // Finaliza o carregamento
    }
  };

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            fontWeight="bold" 
            sx={{ color: '#001f3f', fontFamily: 'Urban Shadow, sans-serif' }}
          >
            Benchiban
          </Typography>
          <Typography variant="h6" color="text.secondary">
            O melhor preço de GPU em primeiro lugar!
          </Typography>
        </Box>

        {/* Exibe o spinner de carregamento ou a mensagem de erro */}
        {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}

        <Grid container spacing={4} justifyContent="center">
          {gpuData.map((gpu, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <GpuCard
                name={gpu.name}
                description={gpu.description}
                image={gpu.image}
                // Desabilita o clique enquanto carrega para evitar múltiplas chamadas
                onClick={() => !isLoading && handleCardClick(gpu.name)} 
                // Adiciona um estilo visual para indicar que está carregando (opcional)
                sx={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? 'wait' : 'pointer' }}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}

export default DashboardPage;
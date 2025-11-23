import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Alert, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ResultCard from '../components/ResultsCard';
import SourceResults from '../components/SourceResults';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const comparisonData = location.state?.data;
  const query = location.state?.query || 'Busca';

  console.log("ResultsPage - Dados recebidos:", comparisonData);

  if (!comparisonData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <AppHeader />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Erro: Dados da comparação não encontrados. Por favor, refaça a busca.
          </Alert>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
          >
            Voltar ao Dashboard
          </Button>
        </Container>
        <AppFooter />
      </Box>
    );
  }

  const bestDeal = comparisonData.overall_best_deal;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppHeader />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Botão Voltar */}
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            borderColor: '#001f3f',
            color: '#001f3f',
            textTransform: 'none',
            '&:hover': {
              borderColor: '#003d7a',
              backgroundColor: 'rgba(0, 31, 63, 0.05)',
            }
          }}
        >
          Nova Busca
        </Button>

        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4, fontWeight: 'bold' }}>
          Resultados para: "{query}"
        </Typography>

        {/* --- SEÇÃO DE MELHOR OFERTA --- */}
        {bestDeal ? (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            {/* Exibe a fonte no título conforme solicitado */}
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
            >
              Melhor Preço Encontrado no {bestDeal.source}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ResultCard
                // Passando os dados corretos do backend para o componente
                title={bestDeal.title}
                price={bestDeal.price_brl}
                link={bestDeal.link}
                seller={bestDeal.seller}
                
                // isBestPrice ativa o estilo de destaque (borda azul, maior)
                isBestPrice={true}
                
              />
            </Box>
          </Box>
        ) : (
          <Alert severity="warning" sx={{ mb: 4 }}>
            Não foi possível determinar a melhor oferta geral no momento.
          </Alert>
        )}

        {/* --- LISTA DE RESULTADOS POR FONTE --- */}
        {Object.entries(comparisonData.results_by_source).map(([sourceName, items]) =>
          items && items.length > 0 ? (
            <SourceResults key={sourceName} sourceName={sourceName} items={items} />
          ) : null
        )}

        {/* Mensagem de "Nenhum resultado" se todas as listas estiverem vazias */}
        {Object.values(comparisonData.results_by_source).every(list => list.length === 0) && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Nenhuma oferta encontrada nas lojas pesquisadas.
          </Typography>
        )}
      </Container>

      <AppFooter />
    </Box>
  );
}

export default ResultsPage;
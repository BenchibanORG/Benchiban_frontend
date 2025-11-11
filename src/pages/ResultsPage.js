// src/pages/ResultsPage.js
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

  console.log("ResultsPage - Dados completos recebidos:", comparisonData);

  if (!comparisonData) {
    console.error("ResultsPage - comparisonData está nulo ou indefinido!");
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <AppHeader />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Erro: Não foi possível carregar os dados da comparação. Por favor, volte e tente novamente.
          </Alert>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            sx={{
              borderColor: '#001f3f',
              color: '#001f3f',
              '&:hover': {
                borderColor: '#003d7a',
                backgroundColor: 'rgba(0, 31, 63, 0.05)',
              },
            }}
          >
            Voltar ao Dashboard
          </Button>
        </Container>
        <AppFooter />
      </Box>
    );
  }

  const bestDeal = comparisonData.overall_best_deal;

  const normalizeDeal = (deal) => {
    if (!deal) return null;
    return {
      site: deal.source || deal.site || 'Site desconhecido',
      country: deal.country || 'País não informado',
      price: deal.price_brl || deal.price || null,
      link: deal.url || deal.link || '#',
    };
  };

  const normalizedBestDeal = normalizeDeal(bestDeal);

  console.log("ResultsPage - Objeto overall_best_deal normalizado:", normalizedBestDeal);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppHeader />
      
      <Container maxWidth="lg" sx={{ py: 6 }}>
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

        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Resultados para: {query}
        </Typography>

        {normalizedBestDeal ? (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h5"
              component="h2"
              sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
            >
              Melhor Preço Encontrado
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ResultCard
                site={normalizedBestDeal.site}
                country={normalizedBestDeal.country}
                price={normalizedBestDeal.price}
                link={normalizedBestDeal.link}
                isBestPrice={true}
                sx={{
                  textAlign: 'left',
                  width: '100%',
                  maxWidth: 900,
                }}
              />
            </Box>
          </Box>
        ) : (
          <>
            {console.warn("ResultsPage - overall_best_deal é 'falsy', renderizando Alert.")}
            <Alert severity="warning" sx={{ mb: 4 }}>
              Não foi possível determinar a melhor oferta geral (verifique a conversão de moeda ou se há ofertas disponíveis).
            </Alert>
          </>
        )}

        {Object.entries(comparisonData.results_by_source).map(([sourceName, items]) =>
          items && items.length > 0 ? (
            <SourceResults key={sourceName} sourceName={sourceName} items={items} />
          ) : null
        )}

        {Object.values(comparisonData.results_by_source).every(list => list.length === 0) && (
          <Typography align="center" color="text.secondary" sx={{ mt: 4 }}>
            Nenhuma oferta encontrada para esta placa de vídeo nas fontes pesquisadas.
          </Typography>
        )}
      </Container>

      <AppFooter />
    </Box>
  );
}

export default ResultsPage;
import React from 'react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { Box, Container, Typography, Alert, Button } from '@mui/material';
import ResultCard from '../components/ResultsCard';
import SourceResults from '../components/SourceResults';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ResultsPage() {
  const location = useLocation();
  const comparisonData = location.state?.data;
  const query = location.state?.query || 'Busca';

  console.log("ResultsPage - Dados completos recebidos:", comparisonData);

  if (!comparisonData) {
    console.error("ResultsPage - comparisonData está nulo ou indefinido!");
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Alert severity="error">
          Erro: Não foi possível carregar os dados da comparação. Por favor, volte e tente novamente.
        </Alert>
        <Button
          component={RouterLink}
          to="/"
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ mt: 2 }}
        >
          Voltar ao Dashboard
        </Button>
      </Container>
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Botão de Nova Busca */}
      <Button
        component={RouterLink}
        to="/"
        variant="outlined"
        startIcon={<ArrowBackIcon />}
        sx={{ mb: 3 }}
      >
        Nova Busca
      </Button>

      <Typography variant="h4" component="h1" gutterBottom align="center">
        Resultados para: {query}
      </Typography>

      {/* 1. Melhor Oferta Geral */}
      {normalizedBestDeal ? (
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h5"
            component="h2"
            sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}
          >
            Melhor Preço Encontrado
          </Typography>

          {/* Card centralizado, mas com conteúdo alinhado à esquerda */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <ResultCard
              site={normalizedBestDeal.site}
              country={normalizedBestDeal.country}
              price={normalizedBestDeal.price}
              link={normalizedBestDeal.link}
              isBestPrice={true}
              sx={{
                textAlign: 'left', // <-- garante que o conteúdo fique alinhado à esquerda
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

      {/* 2. Resultados por Fonte */}
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
  );
}

export default ResultsPage;

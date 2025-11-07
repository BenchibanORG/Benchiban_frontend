import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Alert, 
  Button,
  Paper,
  Chip,
  Divider,
  AppBar,
  Toolbar
} from '@mui/material';
import { 
  ArrowBack, 
  EmojiEvents,
  Store,
  AttachMoney
} from '@mui/icons-material';
import ResultCard from '../components/ResultsCard';
import SourceResults from '../components/SourceResults';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const comparisonData = location.state?.data;
  const query = location.state?.query || 'Busca';

  console.log("ResultsPage - Dados completos recebidos:", comparisonData);

  // Erro: Sem dados
  if (!comparisonData) {
    console.error("ResultsPage - comparisonData está nulo ou indefinido!");
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Alert 
            severity="error"
            sx={{ 
              mb: 4,
              borderRadius: 2,
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
            <Typography variant="h6" gutterBottom>
              Erro ao Carregar Dados
            </Typography>
            <Typography variant="body2">
              Não foi possível carregar os dados da comparação. Por favor, volte e tente novamente.
            </Typography>
          </Alert>
          <Button
            onClick={() => navigate('/dashboard')}
            variant="contained"
            size="large"
            startIcon={<ArrowBack />}
            sx={{
              px: 4,
              py: 1.5,
              backgroundColor: '#001f3f',
              '&:hover': {
                backgroundColor: '#003d7a',
              },
            }}
          >
            Voltar ao Dashboard
          </Button>
        </Container>
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

  // Contar total de ofertas
  const totalOffers = Object.values(comparisonData.results_by_source)
    .reduce((sum, items) => sum + items.length, 0);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      {/* Header */}
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
            onClick={() => navigate('/dashboard')}
            variant="outlined"
            startIcon={<ArrowBack />}
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
            Nova Busca
          </Button>
        </Toolbar>
      </AppBar>

      {/* Hero Section com Query */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
          color: 'white',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            {query}
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Chip
              icon={<Store sx={{ color: 'white !important' }} />}
              label={`${Object.keys(comparisonData.results_by_source).length} Fontes Pesquisadas`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
            <Chip
              icon={<AttachMoney sx={{ color: 'white !important' }} />}
              label={`${totalOffers} Ofertas Encontradas`}
              sx={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold',
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Melhor Oferta Geral usando ResultCard */}
        {normalizedBestDeal ? (
          <Paper
            elevation={3}
            sx={{
              p: 4,
              mb: 6,
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
              border: '2px solid #00c853',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <EmojiEvents sx={{ fontSize: 40, color: '#00c853' }} />
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  sx={{ fontWeight: 'bold', color: '#001f3f' }}
                >
                  🏆 Melhor Preço Encontrado
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  A oferta mais vantajosa entre todas as fontes pesquisadas
                </Typography>
              </Box>
            </Box>

            {/* USANDO O COMPONENTE ResultCard */}
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ResultCard
                site={normalizedBestDeal.site}
                country={normalizedBestDeal.country}
                price={normalizedBestDeal.price}
                link={normalizedBestDeal.link}
                isBestPrice={true}
              />
            </Box>
          </Paper>
        ) : (
          <>
            {console.warn("ResultsPage - overall_best_deal é 'falsy', renderizando Alert.")}
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 4,
                borderRadius: 2,
              }}
            >
              Não foi possível determinar a melhor oferta geral. Verifique a conversão de moeda ou se há ofertas disponíveis.
            </Alert>
          </>
        )}

        {/* Divider */}
        <Divider sx={{ my: 6 }}>
          <Chip label="Todas as Ofertas por Fonte" sx={{ fontWeight: 'bold' }} />
        </Divider>

        {/* Resultados por Fonte usando SourceResults */}
        {Object.entries(comparisonData.results_by_source).map(([sourceName, items]) =>
          items && items.length > 0 ? (
            <Box key={sourceName} sx={{ mb: 5 }}>
              <SourceResults sourceName={sourceName} items={items} />
            </Box>
          ) : null
        )}

        {/* Mensagem: Nenhuma oferta */}
        {Object.values(comparisonData.results_by_source).every(list => list.length === 0) && (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              backgroundColor: 'white',
              borderRadius: 3,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Nenhuma oferta encontrada
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Não encontramos ofertas para esta placa de vídeo nas fontes pesquisadas.
              Tente novamente mais tarde.
            </Typography>
          </Paper>
        )}
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
          <Typography variant="caption" sx={{ opacity: 0.6, mt: 1, display: 'block' }}>
            Preços atualizados em tempo real | Conversão automática para BRL
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default ResultsPage;
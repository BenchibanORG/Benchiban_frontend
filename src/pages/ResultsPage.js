import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Alert, Button, Paper, CircularProgress, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ResultCard from '../components/ResultsCard';
import SourceResults from '../components/SourceResults';
import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import api from '../services/api';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const comparisonData = location.state?.data;
  const query = location.state?.query || 'Busca';

  // --- Estado ---
  const [exchangeRate, setExchangeRate] = useState(null);
  const [rateTimestamp, setRateTimestamp] = useState(null); 
  const [rateLoading, setRateLoading] = useState(false);

  // --- Efeito: Carga Inicial ---
  useEffect(() => {
    if (comparisonData?.current_exchange_rate) {
      setExchangeRate(comparisonData.current_exchange_rate);
      
      // Verifica se o backend enviou o horário do cache (exchange_rate_timestamp).
      // Se sim, usa ele. Se não, usa o horário atual como fallback.
      if (comparisonData.exchange_rate_timestamp) {
        setRateTimestamp(new Date(comparisonData.exchange_rate_timestamp));
      } else {
        setRateTimestamp(new Date());
      }
      
    } else {
      // Se não veio dados, busca agora
      fetchRate(false);
    }
  }, [comparisonData]);

  /*// --- Função: Atualizar Cotação ---
  const fetchRate = async (forceRefresh = false) => {
    setRateLoading(true);
    try {
      const data = await api.getExchangeRate(forceRefresh);
      if (data && data.rate) {
        setExchangeRate(data.rate);
        
        // Se a API retornar timestamp, usamos ele. Senão, usamos agora.
        if (data.timestamp) {
            setRateTimestamp(new Date(data.timestamp));
        } else {
            setRateTimestamp(new Date());
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar cotação:", error);
    } finally {
      setRateLoading(false);
    }
  };*/

  // Helper para formatar horário
  const formatTime = (date) => {
    if (!date) return '';
    return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  if (!comparisonData) {
    return (
      <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
        <AppHeader />
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            Erro: Dados da comparação não encontrados.
          </Alert>
          <Button onClick={() => navigate('/dashboard')} variant="outlined" startIcon={<ArrowBackIcon />}>
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
        <Button
          onClick={() => navigate('/dashboard')}
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            mb: 3,
            borderColor: '#001f3f',
            color: '#001f3f',
            textTransform: 'none',
            '&:hover': { borderColor: '#003d7a', backgroundColor: 'rgba(0, 31, 63, 0.05)' }
          }}
        >
          Nova Busca
        </Button>

        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 2, fontWeight: 'bold' }}>
          Resultados para: "{query}"
        </Typography>

        {/* --- CARD DE INFORMAÇÃO DA COTAÇÃO --- */}
        <Paper elevation={0} sx={{ mb: 5, p: 2, backgroundColor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <InfoOutlinedIcon color="primary" fontSize="small" />
                        <Typography variant="subtitle2" color="text.primary">
                            <strong>Dólar Comercial:</strong> R$ {exchangeRate ? exchangeRate.toFixed(4) : '---'}
                        </Typography>
                        
                        {/* Exibição do Horário */}
                        {rateTimestamp && (
                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', ml: 1 }}>
                                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                {formatTime(rateTimestamp)}
                            </Typography>
                        )}
                    </Box>
                    <Typography variant="caption" color="text.secondary" display="block" sx={{ ml: 3.5 }}>
                        Valores do eBay são convertidos automaticamente. Impostos de importação não inclusos.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {rateLoading && <CircularProgress size={20} />}
                    <Tooltip title="Buscar cotação em tempo real agora">
                        <Button 
                            variant="text" 
                            size="small" 
                            startIcon={<RefreshIcon />}
                            onClick={() => fetchRate(true)}
                            disabled={rateLoading}
                            sx={{ textTransform: 'none', fontWeight: 'bold' }}
                        >
                            Atualizar Cotação
                        </Button>
                    </Tooltip>
                </Box>

            </Box>
        </Paper>

        {/* --- SEÇÃO DE MELHOR OFERTA --- */}
        {bestDeal ? (
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
              Melhor Preço Encontrado no {bestDeal.source}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
              <ResultCard
                title={bestDeal.title}
                link={bestDeal.link}
                seller={bestDeal.seller_username || bestDeal.seller}
                rating={bestDeal.seller_rating || bestDeal.rating}
                priceOriginal={bestDeal.price_original}
                currencyOriginal={bestDeal.currency_original}
                priceBrl={bestDeal.price_brl}
                exchangeRate={exchangeRate}
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
            <SourceResults 
                key={sourceName} 
                sourceName={sourceName} 
                items={items}
                exchangeRate={exchangeRate}
            />
          ) : null
        )}

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
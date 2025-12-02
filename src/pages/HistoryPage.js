// src/pages/HistoryPage.js
import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import {
  CurrencyExchange as CurrencyExchangeIcon,
  AttachMoney as AttachMoneyIcon,
  History as HistoryIcon
} from '@mui/icons-material';

import AppHeader from '../components/AppHeader';
import AppFooter from '../components/AppFooter';
import { getProductHistory } from '../services/api';

const GPU_OPTIONS = [
  "AMD Radeon PRO W7900 48GB",
  "AMD Radeon RX 7600 XT 16GB",
  "AMD Radeon RX 7900 XT 20GB",
  "AMD Radeon RX 7900 XTX 24GB",
  "Intel Arc A770 16GB",
  "NVIDIA RTX 4070 Ti SUPER 16GB",
  "NVIDIA RTX 4080 Super 16GB",
  "NVIDIA RTX 5090 32GB",
  "NVIDIA RTX 6000 Ada 48GB",
  "NVIDIA RTX A6000 48GB",
];

const GPU_OPTIONS_SORTED = [...GPU_OPTIONS].sort((a, b) =>
  a.localeCompare(b, "pt-BR", { sensitivity: "base" })
);

function HistoryPage() {
  const [selectedGpu, setSelectedGpu] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historyData, setHistoryData] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [currencyMode, setCurrencyMode] = useState('BRL');

  const handleSelectGpu = async (gpuName) => {
    setSelectedGpu(gpuName);
    setLoading(true);
    setError(null);
    setHistoryData(null);
    setChartData([]);

    try {
      const data = await getProductHistory(gpuName, 30);
      if (!data.history || data.history.length === 0) {
        setError('Nenhum histórico encontrado para este produto.');
      } else {
        setHistoryData(data);
        processChartData(data.history);
      }
    } catch (err) {
      setError('Erro ao buscar histórico. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // AGRUPAMENTO POR DIA
  // -------------------------------------------------------------
  const processChartData = (historyList) => {
    const grouped = {};

    historyList.forEach(item => {
      const day = item.date.split("T")[0];

      if (!grouped[day]) {
        grouped[day] = {
          date: day,
          displayDate: day.split("-").reverse().join("/"),
          amazon_brl: null,
          amazon_usd: null,
          ebay_brl: null,
          ebay_usd: null,
          exchange_rate: item.exchange_rate || null
        };
      }

      if (item.exchange_rate) {
        grouped[day].exchange_rate = item.exchange_rate;
      }

      const lower = item.source.toLowerCase();

      if (lower.includes("amazon")) {
        grouped[day].amazon_brl = item.price_brl;
        grouped[day].amazon_usd = item.price_usd;
      }

      if (lower.includes("ebay")) {
        grouped[day].ebay_brl = item.price_brl;
        grouped[day].ebay_usd = item.price_usd;
      }
    });

    const chartArray = Object.values(grouped).sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    setChartData(chartArray);
  };

  const handleCurrencyChange = (_, newMode) => {
    if (newMode !== null) setCurrencyMode(newMode);
  };

  // -------------------------------------------------------------
  // FUNÇÃO HELPER DE FORMATAÇÃO
  // -------------------------------------------------------------
  const formatCurrencyValue = (value, mode) => {
    if (value === null || value === undefined) return '';
    return new Intl.NumberFormat(mode === 'BRL' ? 'pt-BR' : 'en-US', {
      style: 'currency',
      currency: mode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  // -------------------------------------------------------------
  // TOOLTIP
  // -------------------------------------------------------------
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const dp = payload[0].payload || {};

    return (
      <Paper elevation={10} sx={{ p: 2.5, borderRadius: 2, border: '1px solid #ddd' }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {dp.displayDate}
        </Typography>

        {currencyMode === "BRL" && (
          <>
            {dp.amazon_brl && (
              <Typography sx={{ color: "#FF9900", fontWeight: 600 }}>
                Amazon: {formatCurrencyValue(dp.amazon_brl, 'BRL')}
              </Typography>
            )}

            {dp.ebay_brl && (
              <Typography sx={{ color: "#0064D2", fontWeight: 600 }}>
                eBay: {formatCurrencyValue(dp.ebay_brl, 'BRL')}
              </Typography>
            )}
          </>
        )}

        {currencyMode === "USD" && (
          <>
            {/* SOMENTE EBAY EM USD */}
            {dp.ebay_usd && (
              <Typography sx={{ color: "#0064D2", fontWeight: 600 }}>
                eBay: {formatCurrencyValue(dp.ebay_usd, 'USD')}
              </Typography>
            )}
          </>
        )}

        {dp.exchange_rate && (
          <Box sx={{ mt: 2, borderTop: "1px solid #eee", pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Cotação do dólar no dia:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              1 USD = R$ {dp.exchange_rate.toFixed(2)}
            </Typography>
          </Box>
        )}
      </Paper>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f7fa' }}>
      <AppHeader />

      {/* Hero */}
      <Box sx={{
        background: 'linear-gradient(135deg, #001f3f 0%, #003d7a 100%)',
        color: 'white',
        py: 8,
        textAlign: 'center'
      }}>
        <Container maxWidth="lg">
          <HistoryIcon sx={{ fontSize: 60, mb: 2 }} />
          <Typography variant="h2" fontWeight="bold">
            Histórico de Preços
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mt: 1 }}>
            Acompanhe a evolução dos preços nos últimos 30 dias
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ mb: 5, textAlign: 'center' }}>
          <Typography variant="h4" fontWeight="bold" sx={{ color: '#001f3f' }}>
            Buscar Histórico
          </Typography>
          <Typography color="text.secondary">
            Selecione uma GPU para visualizar o histórico
          </Typography>
        </Box>

        <Paper sx={{ p: 3, mb: 5 }}>
          <FormControl fullWidth>
            <InputLabel id="gpu-select-label">Selecione a GPU</InputLabel>

            <Select
              labelId="gpu-select-label"
              id="gpu-select"
              value={selectedGpu}
              label="Selecione a GPU"
              onChange={(e) => handleSelectGpu(e.target.value)}
              data-testid="gpu-select"
            >
              {GPU_OPTIONS_SORTED.map((gpu) => (
                <MenuItem key={gpu} value={gpu}>{gpu}</MenuItem>
              ))}
            </Select>
          </FormControl>

        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        {loading && (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CircularProgress size={60} />
            <Typography sx={{ mt: 2 }}>Carregando...</Typography>
          </Box>
        )}

        {!loading && chartData.length > 0 && (
          <Paper sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#001f3f' }}>
                  Evolução de Preços
                </Typography>
                <Typography color="text.secondary">
                  {historyData?.product_name || selectedGpu}
                </Typography>
              </Box>

              <ToggleButtonGroup value={currencyMode} exclusive onChange={handleCurrencyChange}>
                <ToggleButton value="BRL">
                  <CurrencyExchangeIcon sx={{ mr: 1 }} /> R$ (BRL)
                </ToggleButton>
                <ToggleButton value="USD">
                  <AttachMoneyIcon sx={{ mr: 1 }} /> USD
                </ToggleButton>
              </ToggleButtonGroup>
            </Stack>

            <Box sx={{ height: 480 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis 
                    dataKey="displayDate" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70} 
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  {/* --- CORREÇÃO PRINCIPAL AQUI (EIXO Y) --- */}
                  <YAxis 
                    tickFormatter={(value) => formatCurrencyValue(value, currencyMode)}
                    width={90} // Aumentei a largura para caber "R$ 10.000,00"
                    tick={{ fill: '#666', fontSize: 12 }}
                  />
                  
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#999', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} />

                  {/* BRL */}
                  {currencyMode === "BRL" && (
                    <>
                      <Line 
                        type="monotone" 
                        name="Amazon" 
                        dataKey="amazon_brl" 
                        stroke="#FF9900" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 8 }}
                        connectNulls 
                      />
                      <Line 
                        type="monotone" 
                        name="eBay" 
                        dataKey="ebay_brl" 
                        stroke="#0064D2" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 8 }}
                        connectNulls 
                      />
                    </>
                  )}

                  {/* USD — SOMENTE eBay */}
                  {currencyMode === "USD" && (
                    <>
                      <Line 
                        type="monotone" 
                        name="eBay" 
                        dataKey="ebay_usd" 
                        stroke="#0064D2" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2 }} 
                        activeDot={{ r: 8 }}
                        connectNulls 
                      />
                    </>
                  )}
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        )}
      </Container>

      <AppFooter />
    </Box>
  );
}

export default HistoryPage;
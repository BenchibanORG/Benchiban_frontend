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
  "NVIDIA RTX A6000 48GB"
].sort();

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
  // TOOLTIP
  // -------------------------------------------------------------
  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || payload.length === 0) return null;

    const dp = payload[0].payload || {};

    return (
      <Paper elevation={10} sx={{ p: 2.5, borderRadius: 2 }}>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          {dp.displayDate}
        </Typography>

        {currencyMode === "BRL" && (
          <>
            {dp.amazon_brl && (
              <Typography sx={{ color: "#FF9900", fontWeight: 600 }}>
                Amazon: R$ {dp.amazon_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Typography>
            )}

            {dp.ebay_brl && (
              <Typography sx={{ color: "#0064D2", fontWeight: 600 }}>
                eBay: R$ {dp.ebay_brl.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </Typography>
            )}
          </>
        )}

        {currencyMode === "USD" && (
          <>
            {/* 🔥 SOMENTE EBAY EM USD */}
            {dp.ebay_usd && (
              <Typography sx={{ color: "#0064D2", fontWeight: 600 }}>
                eBay: $ {dp.ebay_usd.toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </Typography>
            )}
          </>
        )}

        {dp.exchange_rate && (
          <Box sx={{ mt: 2, borderTop: "1px solid #ddd", pt: 1 }}>
            <Typography variant="caption" color="text.secondary">
              Cotação do dólar no dia:
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              1 USD = R$ {dp.exchange_rate.toFixed(4)}
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
            <InputLabel>Selecione a GPU</InputLabel>
            <Select
              value={selectedGpu}
              label="Selecione a GPU"
              onChange={(e) => handleSelectGpu(e.target.value)}
            >
              {GPU_OPTIONS.map(gpu => (
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
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="4 4" stroke="#ddd" />
                  <XAxis dataKey="displayDate" angle={-45} textAnchor="end" height={70} />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />

                  {/* 🔥 LEGENDA NO TOPO */}
                  <Legend verticalAlign="top" align="center" />

                  {/* BRL */}
                  {currencyMode === "BRL" && (
                    <>
                      <Line type="monotone" name="Amazon" dataKey="amazon_brl" stroke="#FF9900" strokeWidth={4} dot={{ r: 6 }} connectNulls />
                      <Line type="monotone" name="eBay" dataKey="ebay_brl" stroke="#0064D2" strokeWidth={4} dot={{ r: 6 }} connectNulls />
                    </>
                  )}

                  {/* USD — SOMENTE eBay */}
                  {currencyMode === "USD" && (
                    <>
                      <Line type="monotone" name="eBay" dataKey="ebay_usd" stroke="#0064D2" strokeWidth={4} dot={{ r: 6 }} connectNulls />
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

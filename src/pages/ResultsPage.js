import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, CircularProgress } from '@mui/material'; // Grid não é mais necessário aqui
import ResultCard from '../components/ResultsCard';
import AuthLayout from '../components/AuthLayout';

const mockResults = [
  { site: 'Newegg', country: 'Estados Unidos', price: 9800.50, link: '#' },
  { site: 'Mercado Livre', country: 'Brasil', price: 11500.00, link: '#' },
  { site: 'Caseking', country: 'Europa', price: 10250.75, link: '#' },
  { site: 'AliExpress', country: 'China', price: 9550.90, link: '#' },
];

function ResultsPage() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [bestDeal, setBestDeal] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      const sortedResults = [...mockResults].sort((a, b) => a.price - b.price);
      setBestDeal(sortedResults[0]);
      setResults(sortedResults);
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <AuthLayout title="BUSCANDO PREÇOS...">
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 10 }}>
          <CircularProgress size={60} />
        </Box>
        <Typography variant="h6" align="center" color="text.secondary">
          Estamos vasculhando a web em busca da melhor oferta para você!
        </Typography>
      </AuthLayout>
    );
  }

  return (
    <Box sx={{ backgroundColor: '#f0f2f5', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="md">
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Resultado da Busca
        </Typography>

        <Box sx={{ width: '100%', textAlign: 'center', mb: 4, p: 2, backgroundColor: 'white', borderRadius: 2, boxShadow: 1 }}>
          <Typography variant="h6" color="text.secondary">
            Melhor preço encontrado em:
          </Typography>
          <Typography variant="h4" color="primary" fontWeight="bold">
            {bestDeal.site} ({bestDeal.country})
          </Typography>
        </Box>
        
        {/* --- LAYOUT CORRIGIDO AQUI --- */}
        {/* Usamos um Box com Flexbox e a propriedade 'gap' para um espaçamento perfeito */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2, // Aplica um espaçamento de 16px (theme.spacing(2)) entre cada item
          }}
        >
          {results.map((result, index) => (
            // Este Box controla a largura máxima de cada card na lista
            <Box key={index} sx={{ width: '100%' }}>
              <ResultCard 
                site={result.site}
                country={result.country}
                price={result.price}
                link={result.link}
                isBestPrice={result.site === bestDeal.site}
              />
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}

export default ResultsPage;
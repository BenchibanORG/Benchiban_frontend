import React from 'react';
import { Typography, Grid, Box, Paper, Chip } from '@mui/material';
import ResultCard from './ResultsCard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

function SourceResults({ sourceName, items, exchangeRate }) {
  // Formata o nome da fonte para exibição (Ex: 'amazon' -> 'Amazon')
  const formattedSource = sourceName.charAt(0).toUpperCase() + sourceName.slice(1);

  // Define cor do cabeçalho baseado na fonte
  const getHeaderColor = (source) => {
    const s = source.toLowerCase();
    if (s.includes('amazon')) return '#FF9900'; // Laranja Amazon
    if (s.includes('ebay')) return '#0064D2';   // Azul eBay
    return '#333';
  };

  const headerColor = getHeaderColor(sourceName);

  return (
    <Box sx={{ mb: 5 }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 2, 
          mb: 2, 
          bgcolor: `${headerColor}15`, // Cor com 15% opacidade
          borderLeft: `6px solid ${headerColor}`,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <Box display="flex" alignItems="center" gap={2}>
            <ShoppingCartIcon sx={{ color: headerColor }} />
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: '#333' }}>
            Top Resultados: {formattedSource}
            </Typography>
        </Box>
        <Chip label={`${items.length} melhores ofertas`} size="small" />
      </Paper>

      <Grid container spacing={3}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <ResultCard
              title={item.title}
              link={item.link}
              seller={item.seller_username || item.seller}
              rating={item.seller_rating || item.rating}
              priceOriginal={item.price_original}
              currencyOriginal={item.currency_original}
              priceBrl={item.price_brl}
              priceUsd={item.price_usd}
              exchangeRate={exchangeRate}
              isBestPrice={false}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SourceResults;
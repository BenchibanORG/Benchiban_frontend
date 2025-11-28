import React from 'react';
import { Box, Typography, Grid, Divider } from '@mui/material';
import ResultCard from './ResultsCard'; // Importamos o componente inteligente

function SourceResults({ sourceName, items, exchangeRate }) {
  // Se não houver itens, não renderiza nada
  if (!items || items.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ mt: 8, mb: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize', fontWeight: 'bold', color: 'text.primary' }}>
        TOP 3 Melhores Ofertas - {sourceName.replace('_', ' ')}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${sourceName}-${index}`}>
            {/* Em vez de criar o Card na mão, usamos o ResultCard.
                Ele já sabe lidar com exchangeRate, priceOriginal, etc.
            */}
            <ResultCard
              title={item.title}
              
              // Dados de Preço e Moeda
              priceOriginal={item.price_original}
              currencyOriginal={item.currency_original}
              priceBrl={item.price_brl}
              exchangeRate={exchangeRate} // Passamos a cotação dinâmica
              
              // Metadados
              link={item.link}
              seller={item.seller_username || item.seller} // Prioriza username se existir
              rating={item.rating}
              
              // Estilo: False para não destacar como "Melhor Oferta"
              isBestPrice={false} 
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SourceResults;
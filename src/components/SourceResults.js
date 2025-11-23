import React from 'react';
import { Box, Typography, Card, CardContent, Button, Grid, Divider } from '@mui/material';

// Função auxiliar para formatar moeda
const formatCurrency = (value, currency = 'BRL') => {
  if (value === null || value === undefined) return 'N/A';
  return value.toLocaleString('pt-BR', { style: 'currency', currency: currency });
};

function SourceResults({ sourceName, items }) {
  // Se não houver itens para esta fonte, não renderiza nada
  if (!items || items.length === 0) {
    return null; 
  }

  return (
    <Box sx={{ mt: 4, width: '100%' }}>
      <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
        Melhores Ofertas - {sourceName.replace('_', ' ')}
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={`${sourceName}-${index}`}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', boxShadow: 1 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                {/* Título */}
                <Typography variant="body2" color="text.secondary" noWrap title={item.title}>
                  {item.title}
                </Typography>
                
                {/* Preço */}
                <Typography variant="h6" component="p" sx={{ my: 1, fontWeight: 'medium' }}>
                  {formatCurrency(item.price_brl)}
                </Typography>
                
                {/* Vendedor */}
                <Typography variant="caption" display="block" color="text.primary">
                  Vendedor: {item.seller || 'N/A'}
                </Typography>

                {/* Avaliação (Em linha separada) */}
                {item.rating && (
                  <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                    Avaliação: {item.rating}% positivo
                  </Typography>
                )}
              </CardContent>
              
              {/* Botão "VER OFERTA" */}
              <Box sx={{ p: 1, display: 'flex', justifyContent: 'center' }}>
                <Button 
                  size="small" 
                  href={item.link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  sx={{ fontWeight: 'bold' }}
                >
                  VER OFERTA
                </Button>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default SourceResults;
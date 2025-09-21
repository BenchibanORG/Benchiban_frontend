import React from 'react';
// A importação do 'Box' foi removida para corrigir o warning
import { Card, CardContent, Typography, Button, Grid } from '@mui/material';

function ResultCard({ site, country, price, link, isBestPrice = false }) {
  return (
    <Card sx={{ 
      border: isBestPrice ? '2px solid' : '1px solid',
      borderColor: isBestPrice ? 'primary.main' : 'divider',
      borderRadius: 2,
      boxShadow: isBestPrice ? 4 : 1,
      width: '100%' // Garante que o card ocupe o espaço disponível
    }}>
      <CardContent>
        {/* Usamos um Grid container para alinhar os itens horizontalmente */}
        <Grid container spacing={2} alignItems="center">
          
          {/* Coluna da Esquerda (7/12 de largura) */}
          <Grid item xs={7}>
            <Typography variant="h6" component="div">
              {site}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
              {country}
            </Typography>
            <Typography variant="h4">
              R$ {price.toFixed(2).replace('.', ',')}
            </Typography>
          </Grid>
          
          {/* Coluna da Direita (5/12 de largura) */}
          <Grid item xs={5} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              href={link} 
              target="_blank"
            >
              Ver na Loja
            </Button>
          </Grid>

        </Grid>
      </CardContent>
    </Card>
  );
}

export default ResultCard;
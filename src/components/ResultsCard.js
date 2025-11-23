import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Rating } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';

function ResultCard({ title, price, link, seller, rating, isBestPrice = false }) {
  
  // Formata o preço para Real Brasileiro
  const formattedPrice = price 
    ? price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
    : 'Preço indisponível';

  // Lógica para renderizar a avaliação (Estrelas ou Porcentagem)
  const renderRating = () => {
    if (!rating) return null;

    // Se for maior que 5, assume que é porcentagem (ex: eBay manda 99.5)
    if (rating > 5) {
      return (
        <Chip 
          icon={<StarIcon style={{ color: '#faaf00' }} />} 
          label={`${rating}% positivo`} 
          size="small" 
          variant="outlined" 
          sx={{ mt: 1, borderColor: '#faaf00', color: '#ed6c02', fontWeight: 'bold' }}
        />
      );
    }
    
    // Se for menor ou igual a 5, assume que são estrelas (ex: Amazon manda 4.5)
    return (
      <Box display="flex" alignItems="center" mt={1}>
        <Rating value={parseFloat(rating)} precision={0.1} readOnly size="small" />
        <Typography variant="caption" ml={0.5} color="text.secondary">
          ({rating})
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      variant="outlined"
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        borderColor: isBestPrice ? 'primary.main' : 'grey.300',
        boxShadow: isBestPrice ? 4 : 1,
        borderWidth: isBestPrice ? 2 : 1,
        width: isBestPrice ? '100%' : 'auto',
        maxWidth: isBestPrice ? '1100px' : 'auto',
        mx: 'auto',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 0, pb: 2 }}>
        {/* Título / Nome do Produto */}
        <Typography
          variant={isBestPrice ? "h5" : "subtitle1"}
          component="div"
          sx={{ 
            fontWeight: 'bold', 
            lineHeight: 1.2, 
            mb: 1,
            color: isBestPrice ? 'primary.main' : 'text.primary'
          }}
        >
          {title}
        </Typography>

        {/* Preço */}
        <Typography variant="h4" color="text.primary" sx={{ fontWeight: 'bold', my: 1 }}>
          {formattedPrice}
        </Typography>

        {/* Vendedor */}
        <Box display="flex" alignItems="center" mt={1} color="text.secondary">
          <StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" noWrap title={seller}>
            {seller || "Vendedor não informado"}
          </Typography>
        </Box>

        {/* Avaliação */}
        {renderRating()}
      </CardContent>

      {/* Botão de Ação */}
      <Button
        variant="contained"
        fullWidth
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        sx={{
          mt: 'auto',
          textTransform: 'none',
          fontWeight: 'bold',
          bgcolor: isBestPrice ? 'primary.main' : 'grey.800',
          '&:hover': {
            bgcolor: isBestPrice ? 'primary.dark' : 'black',
          },
        }}
      >
        {isBestPrice ? 'Ver na Loja em Destaque' : 'Ver Oferta'}
      </Button>
    </Card>
  );
}

export default ResultCard;
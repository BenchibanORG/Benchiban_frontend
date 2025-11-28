import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Rating } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public'; 

function ResultCard({ 
  title, 
  price, 
  priceOriginal, 
  currencyOriginal, 
  priceBrl, 
  exchangeRate, 
  link, 
  seller, 
  rating, 
  isBestPrice = false 
}) {
  
  // --- Lógica de Preço Inteligente (Igual anterior) ---
  let displayMainPrice = '---';
  let displaySecondaryPrice = null;
  let isImported = false;

  const currency = currencyOriginal || 'BRL';
  const basePrice = priceOriginal || price;

  if (currency === 'USD') {
    isImported = true;
    const finalBrlVal = (exchangeRate && basePrice) 
      ? basePrice * exchangeRate 
      : priceBrl;

    if (finalBrlVal) {
      displayMainPrice = finalBrlVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }
    if (basePrice) {
      displaySecondaryPrice = basePrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

  } else {
    if (basePrice) {
      displayMainPrice = basePrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    } else {
      displayMainPrice = 'Preço indisponível';
    }
  }

  // --- Lógica de Avaliação ---
  const renderRating = () => {
    if (!rating) return null;
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
        // Mantém visual limpo para cards normais, destaca apenas o bestPrice
        borderColor: isBestPrice ? 'primary.main' : 'grey.300',
        boxShadow: isBestPrice ? 4 : 1, 
        borderWidth: isBestPrice ? 2 : 1,
        width: isBestPrice ? '100%' : 'auto',
        maxWidth: isBestPrice ? '1100px' : 'auto',
        mx: 'auto',
      }}
    >
      <CardContent sx={{ flexGrow: 1, p: 0, pb: 2 }}>
        
        {isImported && (
          <Chip 
            label="Importado (EUA)" 
            size="small" 
            color="info" 
            variant="outlined" 
            icon={<PublicIcon fontSize="small" />}
            sx={{ mb: 1, height: 20, fontSize: '0.7rem', border: 'none', pl: 0 }} 
          />
        )}

        {/* Título: Usa h5 se for destaque, subtitle2 se for lista (para caber melhor) */}
        <Typography
          variant={isBestPrice ? "h5" : "subtitle2"} 
          component="div"
          title={title}
          sx={{ 
            fontWeight: 'bold', 
            lineHeight: 1.2, 
            mb: 1,
            color: isBestPrice ? 'primary.main' : 'text.primary',
            display: '-webkit-box',
            overflow: 'hidden',
            WebkitBoxOrient: 'vertical',
            WebkitLineClamp: isBestPrice ? 3 : 2,
          }}
        >
          {title}
        </Typography>

        {/* Preço: Usa h4 se for destaque, h6 se for lista (igual a sua imagem) */}
        <Typography 
            variant={isBestPrice ? "h4" : "h6"} 
            color="text.primary" 
            sx={{ fontWeight: 'bold', mt: 1, mb: 0 }}
        >
          {displayMainPrice}
        </Typography>

        {displaySecondaryPrice && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 2 }}>
                Original: <strong>{displaySecondaryPrice}</strong>
            </Typography>
        )}

        <Box display="flex" alignItems="center" mt={isImported ? 0 : 1} color="text.secondary">
          <StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} />
          <Typography variant="body2" noWrap title={seller}>
            {seller || "Vendedor não informado"}
          </Typography>
        </Box>

        {renderRating()}
      </CardContent>

      <Button
        variant="contained"
        fullWidth
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        size={isBestPrice ? "medium" : "small"} // Botão menor na lista
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
        {isBestPrice ? 'Ver na Loja' : 'Ver Oferta'}
      </Button>
    </Card>
  );
}

export default ResultCard;
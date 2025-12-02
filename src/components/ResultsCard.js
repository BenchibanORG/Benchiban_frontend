import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip, Rating } from '@mui/material';
import StorefrontIcon from '@mui/icons-material/Storefront';
import StarIcon from '@mui/icons-material/Star';
import PublicIcon from '@mui/icons-material/Public';

function ResultCard({
  title,
  price,                    // Preço em BRL (lojas nacionais)
  priceOriginal,            // Preço original (normalmente USD no eBay)
  currencyOriginal,         // Pode vir errado do eBay (ex: 'BRL')
  priceBrl,                 // Preço já convertido (fallback)
  priceUsd,                 // <--- ADICIONADO: Valor exato em Dólar vindo do banco
  exchangeRate,             // Cotação atual
  link,
  seller,
  rating,
  isBestPrice = false,
  source,                   
}) {
  // === REGRA DE OURO: SE FOR DO EBAY → SEMPRE É USD ===
  const isFromEbay = source?.toLowerCase().includes('ebay') || 
                     link?.includes('ebay.com') || 
                     link?.includes('ebay.it') ||
                     seller?.toLowerCase().includes('ebay');

  const currency = (currencyOriginal || '').toString().trim().toUpperCase();
  
  // Força USD se for do eBay, mesmo que a API tenha mandado 'BRL' por engano
  const effectiveCurrency = isFromEbay ? 'USD' : currency;

  const basePrice = priceOriginal ?? price;

  let displayMainPrice = '---';
  let displaySecondaryPrice = null;
  let isImported = false;

  if (effectiveCurrency === 'USD') {
    isImported = true;

    // Preço principal em BRL: usa priceBrl (já convertido) ou calcula com exchangeRate
    const finalBrlValue = priceBrl ?? (exchangeRate && priceOriginal ? priceOriginal * exchangeRate : null);

    if (finalBrlValue) {
      displayMainPrice = Number(finalBrlValue).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } else {
      displayMainPrice = 'Cotação indisponível';
    }

    // === CORREÇÃO AQUI ===
    // Sempre mostra o preço original em USD (porque é do eBay!)
    // Prioriza 'priceUsd' (banco), se não tiver usa 'priceOriginal' (scraping)
    const usdValue = priceUsd ?? priceOriginal;

    if (usdValue) {
      displaySecondaryPrice = Number(usdValue).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD'
      });
    }
  } else {
    // Produto nacional (Kabum, Pichau, etc)
    if (basePrice) {
      displayMainPrice = Number(basePrice).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      });
    } else {
      displayMainPrice = 'Preço indisponível';
    }
  }

  // === Avaliação (igual antes) ===
  const renderRating = () => {
    if (!rating && rating !== 0) return null;

    // Se a nota for maior que 5 (ex: 98%), exibe como porcentagem/texto
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

    // Se for escala de 0 a 5, exibe estrelas
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
        {/* Badge Importado - só aparece se for eBay */}
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
        size={isBestPrice ? "medium" : "small"}
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
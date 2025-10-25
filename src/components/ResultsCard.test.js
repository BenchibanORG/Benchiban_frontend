import React from 'react';
import { Card, CardContent, Typography, Button, Box, Chip } from '@mui/material';

// --- FUNÇÃO DE FORMATAÇÃO MAIS ROBUSTA ---
// Garante que o valor é um número antes de tentar formatá-lo.
const formatCurrency = (value, currency = 'BRL') => {
  // Verifica explicitamente se é um número válido
  if (typeof value !== 'number' || isNaN(value)) {
    return 'N/A'; // Retorna 'Não Aplicável' se o valor for inválido
  }
  try {
    // Usa toLocaleString para formatação correta
    return value.toLocaleString('pt-BR', { style: 'currency', currency: currency });
  } catch (e) {
    // Fallback em caso de erro inesperado na formatação
    console.error("Erro ao formatar moeda:", e, "Valor:", value, "Moeda:", currency);
    // Retorna uma formatação simples como fallback
    return `${currency} ${value.toFixed(2)}`; 
  }
};


function ResultCard({ deal }) {
  if (!deal) {
    console.error("ResultCard recebeu a prop 'deal' como indefinida.");
    return null; // Ou renderize um placeholder/erro
  }

  return (
    <Card sx={{ mt: 4, width: '100%', maxWidth: 600, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" component="div" gutterBottom>
            Melhor Oferta Encontrada
          </Typography>
          {/* Adiciona verificação para 'deal.source' */}
          <Chip label={deal.source || 'Desconhecida'} color="primary" />
        </Box>
        {/* Adiciona verificação para 'deal.title' */}
        <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
          {deal.title || 'Título não disponível'}
        </Typography>
        <Typography variant="h4" component="p" sx={{ my: 2, fontWeight: 'bold' }}>
          {/* A função formatCurrency agora lida com 'undefined' ou 'null' */}
          {formatCurrency(deal.price_brl)}
        </Typography>
        {/* Adiciona verificação para 'deal.seller_username' */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          Vendido por: <strong>{deal.seller_username || 'N/A'}</strong>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {/* Adiciona verificação para 'deal.seller_rating' */}
          Avaliação do Vendedor: {typeof deal.seller_rating === 'number' ? `${deal.seller_rating}%` : 'N/A'}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
        <Button 
          variant="contained" 
          // Adiciona verificação para 'deal.link'
          href={deal.link || '#'} 
          target="_blank" 
          rel="noopener noreferrer"
          // Desabilita o botão se não houver link
          disabled={!deal.link}
        >
          {/* Adiciona verificação para 'deal.source' */}
          Ver Oferta no {deal.source || 'Site'}
        </Button>
      </Box>
    </Card>
  );
}

export default ResultCard;


// src/components/SuggestionSection.js
import React from 'react';
import { Paper, Typography, Button, Box } from '@mui/material';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// URL do seu formulário
const GOOGLE_FORM_URL = "https://forms.gle/5ErByBE5dzLyWr7b8";

// A cor exata do seu Footer
const BRAND_NAVY = '#001f3f';

function SuggestionSection() {
  return (
    <Box sx={{ py: 6, px: 2, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: '100%', 
          width: '100%',
          p: 4,
          borderRadius: 4,
          // Mantive o fundo claro para contrastar com o botão escuro
          background: 'linear-gradient(135deg, #e3f2fd 0%, #f5f5f5 100%)', 
          border: '1px solid #bbdefb',
          textAlign: 'center',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 3
        }}
      >
        <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
          <Box display="flex" alignItems="center" justifyContent={{ xs: 'center', md: 'flex-start' }} mb={1} gap={1}>
            {/* Ícone com a cor do Footer */}
            <AutoFixHighIcon sx={{ color: BRAND_NAVY }} />
            
            {/* Título com a cor do Footer */}
            <Typography variant="h6" fontWeight="bold" sx={{ color: BRAND_NAVY }}>
              Sentiu falta de alguma placa de vídeo de alto desempenho?
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Estamos analisando a adição de novos modelos. Ajude-nos a escolher a próxima!
          </Typography>
        </Box>

        <Button
          variant="contained"
          size="large"
          endIcon={<ArrowForwardIcon />}
          href={GOOGLE_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            fontWeight: 'bold',
            borderRadius: 3,
            px: 4,
            py: 1.5,
            whiteSpace: 'nowrap',
            bgcolor: BRAND_NAVY,
            color: 'white',
            boxShadow: '0 4px 12px rgba(0, 31, 63, 0.4)',
            '&:hover': {
              bgcolor: '#001326',
            },
          }}
        >
          Sugerir GPU
        </Button>
      </Paper>
    </Box>
  );
}

export default SuggestionSection;
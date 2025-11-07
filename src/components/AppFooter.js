// src/components/AppFooter.js
import React from 'react';
import { Box, Container, Typography } from '@mui/material';

function AppFooter() {
  return (
    <Box
      sx={{
        backgroundColor: '#001f3f',
        color: 'white',
        py: 4,
        mt: 8,
        textAlign: 'center',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="body2" sx={{ opacity: 0.8 }}>
          © 2025 Benchiban. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
}

export default AppFooter;
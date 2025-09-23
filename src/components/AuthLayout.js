import React from 'react';
import { createTheme, ThemeProvider, CssBaseline, Container, Box, Typography } from '@mui/material';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#001f3f',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

// Este componente recebe um 'title' e 'children' (o conteúdo do formulário)
function AuthLayout({ title, children }) {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography 
            component="h1" 
            variant="h5"
            sx={{
              fontWeight: 'bold',
              letterSpacing: '0.1rem',
              mb: 3,
            }}
          >
            {title}
          </Typography>
          {children} {/* Aqui é onde o formulário de login/cadastro será renderizado */}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default AuthLayout;
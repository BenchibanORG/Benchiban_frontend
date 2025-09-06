import React from 'react';

// Importando os componentes do MUI
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Link
} from '@mui/material';

// 1. DEFINIÇÃO DO TEMA CLARO E COR CUSTOMIZADA
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1f1a72ff', // Um tom de roxo moderno
    },
  },
  typography: {
    fontFamily: 'sans-serif', // Fonte limpa
  },
});

// 2. COMPONENTE DA TELA DE LOGIN
function LoginPage() {
  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline /> {/* Garante um fundo branco/cinza claro consistente */}

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
              letterSpacing: '0.1rem', // Espaçamento entre as letras
              mb: 3, // Margem inferior
            }}
          >
            LOGIN
          </Typography>

          <Box component="form" noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              variant="filled" // Estilo do campo preenchido, sem a linha inferior
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              variant="filled"
            />
            
            {/* Seção 'Remember me' e 'Forgot?' */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mt: 1,
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Link href="#" variant="body2" sx={{ color: 'text.secondary' }}>
                Forgot?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation // Remove a sombra do botão, deixando-o mais "flat"
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5, // Aumenta a altura do botão (padding vertical)
                textTransform: 'none', // Impede que o texto fique em maiúsculas
                fontSize: '1rem',
              }}
            >
              LOGIN
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
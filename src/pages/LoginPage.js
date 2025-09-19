import React from 'react';
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
  Link,
  Grid
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6c63ff',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
  },
});

function LoginPage() {
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
            LOGIN
          </Typography>
          <Box component="form" noValidate sx={{ width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Endereço de E-mail"
              name="email"
              autoComplete="email"
              autoFocus
              variant="filled"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="senha"
              label="Senha" 
              type="password"
              id="password"
              autoComplete="current-password"
              variant="filled"
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                mt: 1, 
              }}
            >
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Lembre de mim"
              />
              <Link href="#" variant="body2" sx={{ color: 'text.secondary' }}>
                Esqueceu a senha?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disableElevation
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                textTransform: 'none',
                fontSize: '1rem',
              }}
            >
              LOGIN
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link component={RouterLink} to="/register" variant="body2" sx={{ color: 'text.secondary' }}>
                  {"Ainda não tem Conta? Crie uma!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default LoginPage;
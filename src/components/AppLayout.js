// src/components/AppLayout.js
import React from 'react';
import { Box, Container, AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function AppLayout({ children, maxWidth = 'lg', showHeader = true }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
      {showHeader && (
        <AppBar 
          position="static" 
          sx={{ 
            bgcolor: '#001f3f',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Toolbar>
            <Box
              component="img"
              src={benchibanLogo}
              alt="Benchiban Logo"
              sx={{
                height: 40,
                width: 'auto',
                mr: 2,
                cursor: 'pointer',
                filter: 'brightness(0) invert(1)',
              }}
              onClick={() => navigate('/dashboard')}
            />
            <Typography 
              variant="h6" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => navigate('/dashboard')}
            >
              BENCHIBAN
            </Typography>
            <Button 
              color="inherit" 
              onClick={handleLogout}
              sx={{
                textTransform: 'none',
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Sair
            </Button>
          </Toolbar>
        </AppBar>
      )}
      
      <Container maxWidth={maxWidth} sx={{ py: 4 }}>
        {children}
      </Container>
    </Box>
  );
}

export default AppLayout;
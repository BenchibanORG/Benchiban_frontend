// src/components/AppHeader.js
import React from 'react';
import { AppBar, Toolbar, Box, Button } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import benchibanLogo from '../assets/images/benchibanlogo.png';

function AppHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authToken');
    navigate('/login');
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', py: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            component="img"
            src={benchibanLogo}
            alt="Benchiban Logo"
            sx={{
              height: 70,
              width: 'auto',
              objectFit: 'contain',
              display: 'block',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
            onError={(e) => {
              console.error('Erro ao carregar logo:', e);
              e.target.style.display = 'none';
            }}
          />
        </Box>
        
        <Button
          variant="outlined"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{
            textTransform: 'none',
            borderColor: '#001f3f',
            color: '#001f3f',
            '&:hover': {
              borderColor: '#003d7a',
              backgroundColor: 'rgba(0, 31, 63, 0.05)',
            },
          }}
        >
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default AppHeader;
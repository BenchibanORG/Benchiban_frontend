import React from 'react';
import { TextField, Typography, Box } from '@mui/material';

/**
 * Componente TextField personalizado com a estilização padrão
 * dos formulários de autenticação (label, placeholder, estilos sx).
 */
const StyledAuthTextField = ({ label, ...props }) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="body2"
        sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}
      >
        {label}
      </Typography>
      <TextField
        required
        fullWidth
        variant="outlined"
        {...props}
        sx={{
          '& .MuiOutlinedInput-root': {
            bgcolor: '#f8fafc',
            borderRadius: 2,
            '&:hover fieldset': {
              borderColor: '#001f3f',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#001f3f',
              borderWidth: 2,
            },
          },
          '& label.Mui-focused': {
            color: 'transparent',
          },
          '& label': {
            color: 'transparent',
          },
        }}
      />
    </Box>
  );
};

export default StyledAuthTextField;
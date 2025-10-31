import React from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea } from '@mui/material';

function GpuCard({ name, description, image, onClick, sx }) {
  return (
    <Card
      sx={{
        maxWidth: 420,
        mx: 'auto',
        borderRadius: 4,
        overflow: 'hidden',
        backgroundColor: '#fff',
        height: '100%',
        ...sx,
      }}
    >
      <CardActionArea onClick={onClick}>
        <CardMedia
          component="img"
          height="260"
          image={image}
          alt={name}
          sx={{
            objectFit: 'contain',
            p: 2,
            backgroundColor: '#ffffffff',
          }}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            fontWeight="bold"
            sx={{ textAlign: 'center', color: '#001f3f' }}
          >
            {name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              textAlign: 'justify',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              mt: 1,
            }}
          >
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GpuCard;
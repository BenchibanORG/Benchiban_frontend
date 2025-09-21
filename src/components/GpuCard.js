import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography } from '@mui/material';

function GpuCard({ image, name, description }) {
  return (
    <Card sx={{ maxWidth: 345, borderRadius: 4, transition: '0.3s', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image={image}
          alt={name}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default GpuCard;
import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import GpuCard from './GpuCard';

describe('GpuCard Component', () => {
  it('deve renderizar a imagem, nome e descrição da GPU corretamente', () => {
    const mockGpu = {
      name: 'GPU de Teste',
      description: 'Esta é uma descrição de teste.',
      image: 'https://picsum.photos/seed/test/300/200'
    };

    // Envolvemos com BrowserRouter pois o CardActionArea se comporta como um link
    render(
        <BrowserRouter>
            <GpuCard 
                name={mockGpu.name} 
                description={mockGpu.description} 
                image={mockGpu.image} 
            />
        </BrowserRouter>
    );

    expect(screen.getByText('GPU de Teste')).toBeInTheDocument();
    expect(screen.getByText('Esta é uma descrição de teste.')).toBeInTheDocument();
    expect(screen.getByAltText('GPU de Teste')).toBeInTheDocument();
  });
});
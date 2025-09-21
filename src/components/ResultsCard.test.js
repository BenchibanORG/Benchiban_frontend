import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultCard from './ResultsCard';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

describe('ResultCard Component', () => {
  const mockProps = {
    site: 'Loja Exemplo',
    country: 'País Exemplo',
    price: 1234.56,
    link: 'http://exemplo.com',
  };

  it('deve renderizar todas as informações corretamente', () => {
    render(
      <ThemeProvider theme={theme}>
        <ResultCard {...mockProps} />
      </ThemeProvider>
    );

    // Verifica se o nome do site e o país estão na tela
    expect(screen.getByText('Loja Exemplo')).toBeInTheDocument();
    expect(screen.getByText('País Exemplo')).toBeInTheDocument();

    // Verifica se o preço está formatado corretamente
    expect(screen.getByText('R$ 1234,56')).toBeInTheDocument();

    // Verifica se o botão "Ver na Loja" é um link para o lugar certo
    const buttonLink = screen.getByRole('link', { name: /ver na loja/i });
    expect(buttonLink).toBeInTheDocument();
    expect(buttonLink).toHaveAttribute('href', mockProps.link);
  });

  it('deve aplicar o estilo de destaque quando for o melhor preço', () => {
    render(
      <ThemeProvider theme={theme}>
        <ResultCard {...mockProps} isBestPrice={true} />
      </ThemeProvider>
    );
    const cardElement = screen.getByText('Loja Exemplo').closest('.MuiCard-root');
    expect(cardElement).toHaveStyle('border-width: 2px');
  });
});
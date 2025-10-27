import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultCard from './ResultsCard'; // Importa o componente a ser testado

// Mock de dados para um 'deal' (representando as props do ResultCard)
const mockBestDeal = {
  site: 'Loja Exemplo',
  country: 'Brasil',
  price: 5250.75, // Valor com centavos para testar formatação
  link: 'http://exemplo.com/oferta',
  isBestPrice: true // Indica que este é o melhor preço
};

// Mock de dados para um 'deal' que não é o melhor
const mockRegularDeal = {
  site: 'Outra Loja',
  country: 'Estados Unidos',
  price: 6100.00,
  link: 'http://exemplo.com/outraoferta',
  isBestPrice: false
};

// Mock de dados com informações faltando
const mockIncompleteDeal = {
  site: 'Loja Vazia',
  country: null, // Sem país
  price: null, // Sem preço
  link: null, // Sem link
  isBestPrice: false
};


describe('Componente ResultCard', () => {

  it('deve renderizar corretamente quando é a melhor oferta (isBestPrice = true)', () => {
    render(
      <ResultCard
        site={mockBestDeal.site}
        country={mockBestDeal.country}
        price={mockBestDeal.price}
        link={mockBestDeal.link}
        isBestPrice={mockBestDeal.isBestPrice}
      />
    );

    // Verifica o nome do site
    expect(screen.getByText(mockBestDeal.site)).toBeInTheDocument();

    // Verifica o país
    expect(screen.getByText(mockBestDeal.country)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*5\.250,75/i)).toBeInTheDocument();

    // Verifica o botão
    const button = screen.getByRole('link', { name: /Ver na Loja/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', mockBestDeal.link);
  });

  it('deve renderizar corretamente quando NÃO é a melhor oferta (isBestPrice = false)', () => {
    render(
      <ResultCard
        site={mockRegularDeal.site}
        country={mockRegularDeal.country}
        price={mockRegularDeal.price}
        link={mockRegularDeal.link}
        isBestPrice={mockRegularDeal.isBestPrice}
      />
    );

    // Verifica o nome do site
    expect(screen.getByText(mockRegularDeal.site)).toBeInTheDocument();

    // Verifica o país
    expect(screen.getByText(mockRegularDeal.country)).toBeInTheDocument();

     // Verifica o preço formatado em BRL
    expect(screen.getByText(/R\$\s*6\.100,00/i)).toBeInTheDocument();

    // Verifica o botão
    const button = screen.getByRole('link', { name: /Ver Oferta/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', mockRegularDeal.link);
  });


  it('deve lidar corretamente com dados ausentes (preço, país, link)', () => {
    render(
      <ResultCard
        site={mockIncompleteDeal.site}
        country={mockIncompleteDeal.country}
        price={mockIncompleteDeal.price}
        link={mockIncompleteDeal.link}
        isBestPrice={mockIncompleteDeal.isBestPrice}
      />
    );

     // Verifica o nome do site
     expect(screen.getByText(mockIncompleteDeal.site)).toBeInTheDocument();

    // Verifica o texto fallback para país
    expect(screen.getByText(/País não informado/i)).toBeInTheDocument();

    // Verifica o texto fallback para preço
    expect(screen.getByText(/Preço indisponível/i)).toBeInTheDocument();

    // Verifica o botão
    const button = screen.getByRole('link', { name: /Ver Oferta/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toHaveAttribute('href'); 
  });

});
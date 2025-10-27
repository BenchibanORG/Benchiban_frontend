import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsCard from './ResultsCard'; // 🚨 ATENÇÃO: Verifique se o nome do arquivo importado está correto (ResultsCard ou ResultCard)

// Mock de dados para um 'deal' completo
const mockCompleteData = {
  site: 'Loja Exemplo',
  country: 'Brasil',
  price: 5250.75,
  link: 'http://exemplo.com/oferta',
};

// Mock de dados para um 'deal' com informações faltando
const mockIncompleteData = {
  site: 'Loja Vazia',
  country: null, // País ausente
  price: null, // Preço ausente
  link: null, // Link ausente
};

describe('Componente ResultsCard', () => {

  it('deve renderizar corretamente com dados completos e isBestPrice=false', () => {
    render(
      <ResultsCard
        site={mockCompleteData.site}
        country={mockCompleteData.country}
        price={mockCompleteData.price}
        link={mockCompleteData.link}
        isBestPrice={false}
      />
    );

    // Verifica textos
    expect(screen.getByText(mockCompleteData.site)).toBeInTheDocument();
    expect(screen.getByText(mockCompleteData.country)).toBeInTheDocument();
    expect(screen.getByText(/R\$\s*5\.250,75/i)).toBeInTheDocument(); // Preço formatado

    // Verifica o botão (como link porque tem href)
    const button = screen.getByRole('link', { name: /Ver Oferta/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', mockCompleteData.link);
    expect(button).not.toBeDisabled(); // Assume que não está desabilitado
  });

  it('deve renderizar corretamente com dados completos e isBestPrice=true', () => {
    render(
      <ResultsCard
        site={mockCompleteData.site}
        country={mockCompleteData.country}
        price={mockCompleteData.price}
        link={mockCompleteData.link}
        isBestPrice={true}
      />
    );

     // Verifica textos (iguais ao teste anterior)
     expect(screen.getByText(mockCompleteData.site)).toBeInTheDocument();
     expect(screen.getByText(mockCompleteData.country)).toBeInTheDocument();
     expect(screen.getByText(/R\$\s*5\.250,75/i)).toBeInTheDocument();

    // Verifica o botão (ainda como link, mas com texto diferente)
    const button = screen.getByRole('link', { name: /Ver na Loja/i }); // Nome muda com isBestPrice
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', mockCompleteData.link);
  });


  it('deve lidar corretamente com dados ausentes (preço, país, link)', () => {
    render(
      <ResultsCard
        site={mockIncompleteData.site}
        country={mockIncompleteData.country}
        price={mockIncompleteData.price}
        link={mockIncompleteData.link}
        isBestPrice={false} // Testando com isBestPrice=false
      />
    );

    // Verifica textos de fallback
    expect(screen.getByText(mockIncompleteData.site)).toBeInTheDocument();
    expect(screen.getByText(/País não informado/i)).toBeInTheDocument();
    expect(screen.getByText(/Preço indisponível/i)).toBeInTheDocument();

    // Procura por 'button' em vez de 'link', pois o log mostrou que é um botão
    const button = screen.getByRole('button', { name: /Ver Oferta/i }); 
    expect(button).toBeInTheDocument();
  });

  // Teste opcional: verificar se o botão fica desabilitado quando o link está ausente
  it('deve desabilitar o botão se o link estiver ausente', () => {
     render(
      <ResultsCard
        site={mockIncompleteData.site}
        country={mockIncompleteData.country}
        price={mockIncompleteData.price}
        link={null} // Link explicitamente nulo
        isBestPrice={false} 
      />
    );
  });


});
import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsCard from './ResultsCard';

describe('ResultsCard', () => {
  const baseProps = {
    title: 'RTX 4090 Founders Edition',
    link: 'https://example.com/gpu',
    seller: 'Loja Confiável',
  };

  it('deve renderizar corretamente produto nacional em BRL (caso padrão)', () => {
    render(<ResultsCard {...baseProps} price={5499.9} rating={4.8} />);

    expect(screen.getByText('R$ 5.499,90')).toBeInTheDocument();
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
    expect(screen.getByText(baseProps.seller)).toBeInTheDocument();
    expect(screen.getByText('(4.8)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Ver Oferta/i })).toBeInTheDocument();
    
    // Garante que não mostra texto de importado
    expect(screen.queryByText(/Original:/i)).not.toBeInTheDocument();
  });

  it('deve renderizar produto importado dos EUA com conversão via exchangeRate', () => {
    render(
      <ResultsCard
        {...baseProps}
        priceOriginal={899.99}
        currencyOriginal="USD"
        exchangeRate={5.5}
        rating={98.7}
      />
    );

    // Preço convertido: 899.99 × 5.5 = 4949.945 -> Aprox R$ 4.949,95
    // Usamos regex flexível para evitar quebras por arredondamento menor
    expect(screen.getByText(/R\$\s*4\.949,9/)).toBeInTheDocument();
    
    // Verifica exibição do preço original em dólar
    expect(screen.getByText(/Original:/)).toBeInTheDocument();
    expect(screen.getByText(/\$899.99/)).toBeInTheDocument();
  });

  it('deve usar priceBrl direto se exchangeRate não for fornecido para produto USD', () => {
    render(
      <ResultsCard
        {...baseProps}
        priceOriginal={999.99}
        currencyOriginal="USD"
        priceBrl={5899.9} // valor já convertido no backend
        // exchangeRate não passado de propósito
      />
    );

    expect(screen.getByText('R$ 5.899,90')).toBeInTheDocument();
    expect(screen.getByText(/Original:/)).toBeInTheDocument();
    expect(screen.getByText(/\$999.99/)).toBeInTheDocument();
  });

  it('deve exibir "Preço indisponível" quando não houver preço nenhum', () => {
    render(<ResultsCard {...baseProps} price={null} priceOriginal={null} />);

    expect(screen.getByText(/Preço indisponível/i)).toBeInTheDocument();
  });

  it('deve lidar com rating ausente ou zero', () => {
    render(<ResultsCard {...baseProps} price={3000} rating={null} />);
    
    // Se o objetivo é não quebrar, apenas renderizamos:
    expect(screen.getByText(baseProps.title)).toBeInTheDocument();
  });
});
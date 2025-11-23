import React from 'react';
import { render, screen } from '@testing-library/react';
import ResultsCard from './ResultsCard';

// Mock de dados para um item completo (Estilo eBay - Porcentagem)
const mockEbayData = {
  title: 'Placa de Vídeo eBay',
  price: 5250.75,
  link: 'http://ebay.com/oferta',
  seller: 'VendedorTop',
  rating: 99.5 // Maior que 5 -> Porcentagem
};

// Mock de dados para um item completo (Estilo Amazon - Estrelas)
const mockAmazonData = {
  title: 'Placa de Vídeo Amazon',
  price: 4000.00,
  link: 'http://amazon.com/oferta',
  seller: 'Amazon Oficial',
  rating: 4.5 // Menor ou igual a 5 -> Estrelas
};

// Mock de dados faltando informações opcionais
const mockIncompleteData = {
  title: 'Placa Misteriosa',
  price: null,
  link: 'http://link.com',
  seller: null,
  rating: null
};

describe('Componente ResultsCard', () => {

  it('deve renderizar corretamente dados do eBay (Rating > 5 renderiza como porcentagem)', () => {
    render(
      <ResultsCard
        title={mockEbayData.title}
        price={mockEbayData.price}
        link={mockEbayData.link}
        seller={mockEbayData.seller}
        rating={mockEbayData.rating}
        isBestPrice={false}
      />
    );

    // Verifica Título
    expect(screen.getByText(mockEbayData.title)).toBeInTheDocument();
    
    // Verifica Preço Formatado
    expect(screen.getByText(/R\$\s*5\.250,75/i)).toBeInTheDocument();
    
    // Verifica Vendedor
    expect(screen.getByText(mockEbayData.seller)).toBeInTheDocument();
    
    // Verifica Rating como Porcentagem (Chip)
    expect(screen.getByText('99.5% positivo')).toBeInTheDocument();
    
    // Verifica Botão Padrão
    const button = screen.getByRole('link', { name: /Ver Oferta/i });
    expect(button).toHaveAttribute('href', mockEbayData.link);
  });

  it('deve renderizar corretamente dados da Amazon (Rating <= 5 renderiza estrelas)', () => {
    render(
      <ResultsCard
        title={mockAmazonData.title}
        price={mockAmazonData.price}
        link={mockAmazonData.link}
        seller={mockAmazonData.seller}
        rating={mockAmazonData.rating}
        isBestPrice={false}
      />
    );

    // Verifica se o texto numérico da avaliação (ex: "(4.5)") está presente
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    
    // Verifica se NÃO renderizou o texto de porcentagem
    expect(screen.queryByText(/positivo/i)).not.toBeInTheDocument();
  });

  it('deve alterar o estilo e texto quando for Melhor Preço (isBestPrice=true)', () => {
    render(
      <ResultsCard
        title={mockEbayData.title}
        price={mockEbayData.price}
        link={mockEbayData.link}
        seller={mockEbayData.seller}
        rating={mockEbayData.rating}
        isBestPrice={true}
      />
    );

    // O texto do botão deve mudar
    expect(screen.getByRole('link', { name: /Ver na Loja em Destaque/i })).toBeInTheDocument();
    
    // O título deve ser renderizado como h5 (checagem indireta se renderizou sem erro)
    expect(screen.getByText(mockEbayData.title)).toBeInTheDocument();
  });

  it('deve lidar corretamente com dados ausentes (Preço, Vendedor, Rating)', () => {
    render(
      <ResultsCard
        title={mockIncompleteData.title}
        price={mockIncompleteData.price}
        link={mockIncompleteData.link}
        seller={mockIncompleteData.seller}
        rating={mockIncompleteData.rating}
      />
    );

    // Verifica Fallbacks
    expect(screen.getByText(/Preço indisponível/i)).toBeInTheDocument();
    expect(screen.getByText(/Vendedor não informado/i)).toBeInTheDocument();
    
    // Garante que nenhuma avaliação (estrelas ou chip) foi renderizada
    expect(screen.queryByText(/positivo/i)).not.toBeInTheDocument();
    expect(screen.queryByText('()')).not.toBeInTheDocument();
  });

});
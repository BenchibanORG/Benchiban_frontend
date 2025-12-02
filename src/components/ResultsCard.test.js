import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ResultCard from './ResultsCard';

// Mock simples para garantir consistência nos testes de formatação de moeda
// (Opcional, mas ajuda a evitar erros de espaço não quebrável 'NBSP' em alguns ambientes)
const mockCurrency = (val, currency) => {
  return val.toLocaleString('pt-BR', { style: 'currency', currency });
};

describe('ResultCard Component', () => {
  
  // --- TESTES DE PRODUTOS NACIONAIS (AMAZON/OUTROS) ---
  test('deve renderizar um produto nacional (Amazon) corretamente', () => {
    const props = {
      title: 'Placa de Vídeo RTX 4060',
      price: 1800.00,
      seller: 'Amazon BR',
      link: 'https://amazon.com.br/gpu',
      source: 'Amazon',
      rating: 4.5
    };

    render(<ResultCard {...props} />);

    // Título
    expect(screen.getByText('Placa de Vídeo RTX 4060')).toBeInTheDocument();
    // Preço em Reais (Principal)
    expect(screen.getByText(/R\$\s?1\.800,00/i)).toBeInTheDocument();
    // Não deve ter preço secundário (Original: ...)
    expect(screen.queryByText(/Original:/i)).not.toBeInTheDocument();
    // Não deve ter chip de importado
    expect(screen.queryByText('Importado (EUA)')).not.toBeInTheDocument();
    // Botão padrão
    expect(screen.getByRole('link', { name: /Ver Oferta/i })).toHaveAttribute('href', props.link);
  });

  // --- TESTES DE PRODUTOS IMPORTADOS (EBAY) ---
  test('deve renderizar um produto do eBay com preço convertido e original', () => {
    const props = {
      title: 'RTX 3080 Used',
      priceOriginal: 400.00, // USD
      currencyOriginal: 'USD',
      exchangeRate: 5.00,
      priceBrl: null, // Força o cálculo: 400 * 5 = 2000
      seller: 'eBay Seller',
      link: 'https://ebay.com/itm/123',
      source: 'eBay',
      rating: 98.5 // Rating alto (porcentagem)
    };

    render(<ResultCard {...props} />);

    // Verifica Chip de Importado
    expect(screen.getByText('Importado (EUA)')).toBeInTheDocument();

    // Verifica Preço Principal Calculado (400 * 5.00 = R$ 2.000,00)
    expect(screen.getByText(/R\$\s?2\.000,00/i)).toBeInTheDocument();

    // Verifica Preço Original em Dólar (US$ 400.00)
    expect(screen.getByText(/Original:/i)).toBeInTheDocument();
    // Busca aproximada para o valor em dólar
    const originalPriceElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'strong' && content.includes('400.00');
    });
    expect(originalPriceElement).toBeInTheDocument();
  });

  test('deve usar priceBrl se fornecido pelo backend para produtos eBay', () => {
    const props = {
      title: 'GPU Test',
      priceOriginal: 100,
      priceBrl: 550.00, // Backend já mandou convertido
      exchangeRate: 5.00,
      source: 'eBay',
      seller: 'eBay Store'
    };

    render(<ResultCard {...props} />);
    
    // Deve mostrar R$ 550,00 (valor do backend) e não R$ 500,00 (cálculo)
    expect(screen.getByText(/R\$\s?550,00/i)).toBeInTheDocument();
  });

  test('deve priorizar priceUsd do banco para o preço secundário', () => {
    const props = {
      title: 'GPU Rare',
      priceOriginal: 123.45, // Valor do scraping (ignorar)
      priceUsd: 500.00,      // Valor do banco (usar este)
      source: 'eBay',
      seller: 'eBay'
    };

    render(<ResultCard {...props} />);

    // Deve mostrar US$ 500.00 no secundário
    const usdElement = screen.getByText((content, element) => {
        return element.tagName.toLowerCase() === 'strong' && content.includes('500.00');
    });
    expect(usdElement).toBeInTheDocument();
  });

  test('deve exibir rating como estrelas para valores <= 5', () => {
    const props = {
      title: 'Star Rated GPU',
      rating: 4.5
    };
    render(<ResultCard {...props} />);
    
    // Verifica se o texto (4.5) está presente
    expect(screen.getByText('(4.5)')).toBeInTheDocument();
    // O componente Rating do MUI renderiza estrelas, difícil testar visualmente sem snapshot,
    // mas a presença do texto confirma que entrou no bloco correto.
  });

  test('deve exibir rating como chip de porcentagem para valores > 5', () => {
    const props = {
      title: 'Percent Rated GPU',
      rating: 98.5
    };
    render(<ResultCard {...props} />);
    
    // Verifica se renderizou o Chip com o texto correto
    expect(screen.getByText('98.5% positivo')).toBeInTheDocument();
  });

  test('não deve exibir rating se for nulo ou indefinido', () => {
    const props = {
      title: 'No Rating GPU',
      rating: null
    };
    render(<ResultCard {...props} />);
    
    // Garante que não renderizou "Vendedor não informado" (que é do seller) 
    // mas sim que não tem texto de rating
    expect(screen.queryByText('% positivo')).not.toBeInTheDocument();
    expect(screen.queryByText(/\(\d\)/)).not.toBeInTheDocument();
  });
});
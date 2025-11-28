import React from 'react';
import { render, screen } from '@testing-library/react';
import SourceResults from './SourceResults';

// --- MOCK DO COMPONENTE FILHO ---
// Isso isola o teste. Não precisamos que o ResultCard faça cálculos reais,
// apenas verificamos se ele recebeu os props certos do pai.
jest.mock('./ResultsCard', () => {
  return function MockResultCard(props) {
    return (
      <div data-testid="result-card">
        <span data-testid="card-title">{props.title}</span>
        <span data-testid="card-seller">{props.seller}</span>
        <span data-testid="card-price-brl">{props.priceBrl ? 'BRL_VALUE' : 'NULL'}</span>
        <span data-testid="card-rate">{props.exchangeRate}</span>
      </div>
    );
  };
});

const mockItems = [
  {
    title: 'RTX 4090 Ti',
    price_original: 1599.99,
    currency_original: 'USD',
    price_brl: null,
    link: 'https://ebay.com/123',
    seller_username: 'PowerSellerUSA', // Caso com username
    rating: 99.8,
  },
  {
    title: 'RTX 3080 Usada',
    price_brl: 2899.90, // Caso com preço BRL direto
    link: 'https://amazon.com.br/456',
    seller: 'Amazon', // Caso sem username
    rating: 4.7,
  },
  {
    title: 'GTX 1660 Super',
    price_brl: 1299.00,
    link: 'https://aliexpress.com/789',
    seller: null,
    rating: null,
  },
];

describe('SourceResults', () => {
  const exchangeRate = 5.5;

  it('deve renderizar o título da fonte corretamente', () => {
    render(<SourceResults sourceName="ebay" items={mockItems} exchangeRate={exchangeRate} />);
    // Verifica se o título "TOP 3 Melhores Ofertas - ebay" apareceu
    expect(screen.getByText(/Melhores Ofertas - ebay/i)).toBeInTheDocument();
  });

  it('deve renderizar a quantidade correta de cards', () => {
    render(<SourceResults sourceName="amazon" items={mockItems} exchangeRate={exchangeRate} />);
    
    // Devemos ter 3 instâncias do mock do ResultCard
    const cards = screen.getAllByTestId('result-card');
    expect(cards).toHaveLength(3);
  });

  it('deve passar a cotação (exchangeRate) corretamente para os filhos', () => {
    render(<SourceResults sourceName="ebay" items={mockItems} exchangeRate={exchangeRate} />);
    
    // Verifica se o valor 5.5 foi passado para os cards
    const rates = screen.getAllByTestId('card-rate');
    expect(rates[0]).toHaveTextContent('5.5');
  });

  it('deve priorizar seller_username sobre seller', () => {
    render(<SourceResults sourceName="mixed" items={mockItems} exchangeRate={exchangeRate} />);
    
    const sellers = screen.getAllByTestId('card-seller');
    
    // Item 1: Tem seller_username 'PowerSellerUSA', deve usar ele
    expect(sellers[0]).toHaveTextContent('PowerSellerUSA');
    
    // Item 2: Não tem username, tem seller 'Amazon', deve usar ele
    expect(sellers[1]).toHaveTextContent('Amazon');
  });

  it('não deve renderizar nada quando items estiver vazio, null ou undefined', () => {
    const { container } = render(<SourceResults sourceName="ebay" items={[]} />);
    expect(container).toBeEmptyDOMElement();

    const { container: containerNull } = render(<SourceResults sourceName="ebay" items={null} />);
    expect(containerNull).toBeEmptyDOMElement();
  });
});
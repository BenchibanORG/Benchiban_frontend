import React from 'react';
import { render, screen, within } from '@testing-library/react';
import SourceResults from './SourceResults';

// Mock de dados atualizado com as novas propriedades (seller, rating)
const mockItems = [
  {
    title: 'Item 1 - Completo',
    price_brl: 525.50,
    seller: 'vendedor1',
    rating: 99.0,
    link: 'http://link1.com',
    source: 'ebay'
  },
  {
    title: 'Item 2 - Sem Avaliação',
    price_brl: 1200.00,
    seller: 'vendedor2',
    rating: null, // Simula item sem avaliação
    link: 'http://link2.com',
    source: 'amazon'
  },
  {
    title: 'Item 3 - Sem Vendedor',
    price_brl: 300.00,
    seller: null, // Simula item sem vendedor
    rating: 95.5,
    link: 'http://link3.com',
    source: 'aliexpress'
  }
];

describe('Componente SourceResults', () => {

  it('deve renderizar o título da seção corretamente', () => {
    render(<SourceResults sourceName="ebay" items={mockItems} />);
    expect(screen.getByText(/Melhores Ofertas - ebay/i)).toBeInTheDocument();
  });

  it('deve renderizar os dados do item completo corretamente (Título, Preço, Vendedor, Avaliação)', () => {
    render(<SourceResults sourceName="ebay" items={[mockItems[0]]} />);

    // Título
    expect(screen.getByText('Item 1 - Completo')).toBeInTheDocument();
    
    // Preço (R$ 525,50) - Regex flexível para espaços
    expect(screen.getByText((content) => content.includes('R$') && content.includes('525,50'))).toBeInTheDocument();
    
    // Vendedor
    expect(screen.getByText(/Vendedor: vendedor1/i)).toBeInTheDocument();
    
    // Avaliação (em linha separada com texto "positivo")
    expect(screen.getByText(/Avaliação: 99% positivo/i)).toBeInTheDocument();
    
    // Link/Botão
    const linkButton = screen.getByRole('link', { name: /VER OFERTA/i });
    expect(linkButton).toHaveAttribute('href', 'http://link1.com');
  });

  it('NÃO deve renderizar a linha de avaliação se o rating for nulo', () => {
    render(<SourceResults sourceName="amazon" items={[mockItems[1]]} />);

    expect(screen.getByText('Item 2 - Sem Avaliação')).toBeInTheDocument();
    
    // Garante que o texto "Avaliação:" não aparece para este item
    expect(screen.queryByText(/Avaliação:/i)).not.toBeInTheDocument();
  });

  it('deve renderizar "N/A" se o vendedor for nulo', () => {
    render(<SourceResults sourceName="aliexpress" items={[mockItems[2]]} />);

    expect(screen.getByText(/Vendedor: N\/A/i)).toBeInTheDocument();
  });

  it('não deve renderizar nada se a lista de itens estiver vazia', () => {
    const { container } = render(<SourceResults sourceName="ebay" items={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('não deve renderizar nada se a lista de itens for nula ou indefinida', () => {
    const { container: containerNull } = render(<SourceResults sourceName="ebay" items={null} />);
    expect(containerNull).toBeEmptyDOMElement();

    const { container: containerUndefined } = render(<SourceResults sourceName="ebay" items={undefined} />);
    expect(containerUndefined).toBeEmptyDOMElement();
  });

});
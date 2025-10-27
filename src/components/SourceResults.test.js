import React from 'react';
import { render, screen, within } from '@testing-library/react';
import SourceResults from './SourceResults'; // Importa o componente

// Mock de dados para os itens
const mockItems = [
  {
    title: 'Item 1 - Bom Preço BRL',
    price_usd: 100.0,
    price_brl: 525.50,
    currency: 'USD',
    seller_rating: 99.0,
    seller_username: 'vendedor1',
    link: 'http://link1.com',
    source: 'ebay'
  },
  {
    title: 'Item 2 - Sem Preço BRL',
    price_usd: 120.50,
    price_brl: null,
    currency: 'USD',
    seller_rating: 95.0,
    seller_username: 'vendedor2',
    link: 'http://link2.com',
    source: 'ebay'
  },
  {
    title: 'Item 3 - Moeda Diferente (Exemplo)',
    price_usd: 90.00,
    price_brl: null,
    currency: 'EUR',
    seller_rating: 97.0,
    seller_username: 'vendedor3',
    link: 'http://link3.com',
    source: 'ebay'
  }
];

describe('Componente SourceResults', () => {

  it('deve renderizar o título e os itens corretamente', () => {
    const sourceName = 'ebay';
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    expect(screen.getByRole('heading', { name: /Melhores Ofertas - Ebay/i })).toBeInTheDocument();
    expect(screen.getByText(mockItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockItems[1].title)).toBeInTheDocument();
    expect(screen.getByText(mockItems[2].title)).toBeInTheDocument();

    const firstItemCard = screen.getByText(mockItems[0].title).closest('.MuiCard-root');
    expect(within(firstItemCard).getByText(/R\$\s*525,50/i)).toBeInTheDocument();
    expect(within(firstItemCard).getByText(/Vendedor: vendedor1 \(99%?\)/i)).toBeInTheDocument();
    expect(within(firstItemCard).getByRole('link', { name: /Ver Oferta/i })).toHaveAttribute('href', mockItems[0].link);
  });

  it('deve exibir o preço em USD como fallback quando price_brl for nulo', () => {
    const sourceName = 'ebay';
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    const secondItemCard = screen.getByText(mockItems[1].title).closest('.MuiCard-root');
    
    // --- CORREÇÃO AQUI ---
    // Encontra o elemento <p> que contém o preço
    // O seletor ':not([title])' ajuda a evitar pegar o <p> do título se ele também contiver 'N/A'
    const priceElement = within(secondItemCard).getByText((content, element) => {
      return element.tagName.toLowerCase() === 'p' && content.includes('N/A') && !element.hasAttribute('title');
    });
    // Verifica se este elemento <p> contém AMBAS as partes do texto
    expect(priceElement).toHaveTextContent(/N\/A/i);
    // Ajusta a regex para o formato exato renderizado: US$ 120,50
    expect(priceElement).toHaveTextContent(/\(US\$\s*120,50\)/i); 
  });
   
  it('deve exibir o preço original se a moeda não for USD e price_brl for nulo', () => {
    const sourceName = 'ebay';
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    const thirdItemCard = screen.getByText(mockItems[2].title).closest('.MuiCard-root');

    // Encontra o elemento <p> que contém o preço
    const priceElement = within(thirdItemCard).getByText((content, element) => {
       return element.tagName.toLowerCase() === 'p' && content.includes('N/A') && !element.hasAttribute('title');
    });
    // Verifica se este elemento <p> contém AMBAS as partes do texto
    expect(priceElement).toHaveTextContent(/N\/A/i);
     // Ajusta a regex para o formato exato renderizado: € 90,00
    expect(priceElement).toHaveTextContent(/\(€\s*90,00\)/i); 
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

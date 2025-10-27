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
    source: 'ebay' // A fonte é definida no backend
  },
  {
    title: 'Item 2 - Sem Preço BRL',
    price_usd: 120.50,
    price_brl: null, // Testar fallback para USD
    currency: 'USD',
    seller_rating: 95.0,
    seller_username: 'vendedor2',
    link: 'http://link2.com',
    source: 'ebay'
  },
  {
    title: 'Item 3 - Moeda Diferente (Exemplo)',
    price_usd: 90.00, // Preço em USD
    price_brl: null,
    currency: 'EUR', // Moeda diferente
    seller_rating: 97.0,
    seller_username: 'vendedor3',
    link: 'http://link3.com',
    source: 'ebay'
  }
];

describe('Componente SourceResults', () => {

  it('deve renderizar o título e os itens corretamente', () => {
    const sourceName = 'ebay'; // Nome da fonte como recebido do backend
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    // Verifica o título formatado
    expect(screen.getByRole('heading', { name: /Melhores Ofertas - Ebay/i })).toBeInTheDocument();

    // Verifica se todos os 3 itens foram renderizados (procurando pelos títulos)
    expect(screen.getByText(mockItems[0].title)).toBeInTheDocument();
    expect(screen.getByText(mockItems[1].title)).toBeInTheDocument();
    expect(screen.getByText(mockItems[2].title)).toBeInTheDocument();

    // Vamos verificar os detalhes do primeiro item
    const firstItemCard = screen.getByText(mockItems[0].title).closest('.MuiCard-root'); // Encontra o Card pai
    expect(within(firstItemCard).getByText(/R\$\s*525,50/i)).toBeInTheDocument(); // Preço BRL
    expect(within(firstItemCard).getByText(/Vendedor: vendedor1 \(99%?\)/i)).toBeInTheDocument(); // Vendedor e rating
    expect(within(firstItemCard).getByRole('link', { name: /Ver Oferta/i })).toHaveAttribute('href', mockItems[0].link);
  });

  it('deve exibir o preço em USD como fallback quando price_brl for nulo', () => {
    const sourceName = 'ebay';
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    // Encontra o card do segundo item (que não tem price_brl)
    const secondItemCard = screen.getByText(mockItems[1].title).closest('.MuiCard-root');
    // Verifica se o preço BRL (N/A) e o preço USD são exibidos
    expect(within(secondItemCard).getByText(/N\/A\s+\(\$\s*120,50\s+USD\)/i)).toBeInTheDocument();
  });
   
  it('deve exibir o preço original se a moeda não for USD e price_brl for nulo', () => {
    const sourceName = 'ebay';
    render(<SourceResults sourceName={sourceName} items={mockItems} />);

    // Encontra o card do terceiro item (moeda EUR)
    const thirdItemCard = screen.getByText(mockItems[2].title).closest('.MuiCard-root');
    // Verifica se o preço BRL (N/A) e o preço EUR original são exibidos
    expect(within(thirdItemCard).getByText(/N\/A\s+\(€\s*90,00\s+EUR\)/i)).toBeInTheDocument();
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

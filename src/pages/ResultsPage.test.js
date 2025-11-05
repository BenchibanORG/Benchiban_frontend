import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import ResultsPage from './ResultsPage';

// --- MOCKS ---
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
}));

jest.mock('../components/ResultsCard', () => (props) => (
  <div data-testid="mock-result-card">
    Mock ResultCard - Site: {props.site}, Price: {props.price}, isBest: {props.isBestPrice.toString()}
  </div>
));

jest.mock('../components/SourceResults', () => (props) => (
  <div data-testid={`mock-source-results-${props.sourceName}`}>
    Mock SourceResults - Source: {props.sourceName}, Items: {props.items.length}
  </div>
));

// --- MUTE CONSOLE OUTPUTS DURING TESTS ---
beforeAll(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {});
  jest.spyOn(console, 'warn').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterAll(() => {
  console.log.mockRestore();
  console.warn.mockRestore();
  console.error.mockRestore();
});

// --- MOCK DATA ---
const mockApiData = {
  results_by_source: {
    ebay: [
      { title: 'Item eBay 1', price_brl: 500.0, source: 'eBay', seller_username: 'seller1', seller_rating: 99, link: 'link1' },
      { title: 'Item eBay 2', price_brl: 600.0, source: 'eBay', seller_username: 'seller2', seller_rating: 98, link: 'link2' },
    ],
    mercado_livre: [],
  },
  overall_best_deal: {
    title: 'Item eBay 1',
    price_brl: 500.0,
    source: 'eBay',
    seller_username: 'seller1',
    seller_rating: 99,
    link: 'link1',
  },
};

const mockApiDataNoBestDeal = {
  results_by_source: {
    ebay: [{ title: 'Item eBay 1', source: 'eBay' }],
  },
  overall_best_deal: null,
};

const mockApiDataNoResults = {
  results_by_source: {
    ebay: [],
    mercado_livre: [],
  },
  overall_best_deal: null,
};

// --- HELPER ---
const renderComponentWithData = (stateData) => {
  useLocation.mockReturnValue({ state: stateData });
  render(
    <MemoryRouter>
      <ResultsPage />
    </MemoryRouter>
  );
};

describe('Componente ResultsPage', () => {
  beforeEach(() => {
    useLocation.mockClear();
  });

  it('deve renderizar corretamente com dados completos', () => {
    const query = 'RTX 4080';
    renderComponentWithData({ data: mockApiData, query });

    expect(screen.getByRole('heading', { name: `Resultados para: ${query}` })).toBeInTheDocument();

    const bestCard = screen.getByTestId('mock-result-card');
    expect(bestCard).toHaveTextContent('Site: eBay');
    expect(bestCard).toHaveTextContent('Price: 500');
    expect(bestCard).toHaveTextContent('isBest: true');

    const ebayResults = screen.getByTestId('mock-source-results-ebay');
    expect(ebayResults).toBeInTheDocument();
    expect(ebayResults).toHaveTextContent('Items: 2');

    expect(screen.queryByTestId('mock-source-results-mercado_livre')).not.toBeInTheDocument();
    expect(screen.queryByText(/Nenhuma oferta encontrada/i)).not.toBeInTheDocument();
  });

  it('deve exibir aviso se não houver "overall_best_deal"', () => {
    renderComponentWithData({ data: mockApiDataNoBestDeal, query: 'Teste' });

    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/Não foi possível determinar a melhor oferta geral/i);
    expect(screen.getByTestId('mock-source-results-ebay')).toBeInTheDocument();
  });

  it('deve exibir mensagem se nenhuma fonte retornar resultados', () => {
    renderComponentWithData({ data: mockApiDataNoResults, query: 'Nada' });

    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();
    expect(screen.queryByTestId(/mock-source-results-/i)).not.toBeInTheDocument();
    expect(screen.getByText(/Nenhuma oferta encontrada para esta placa de vídeo/i)).toBeInTheDocument();
  });

  it('deve exibir erro se os dados não forem passados corretamente pela navegação', () => {
    useLocation.mockReturnValue({ state: null });
    render(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    expect(screen.getByRole('alert')).toHaveTextContent(/Erro: Não foi possível carregar os dados/i);
    expect(screen.getByRole('link', { name: /Voltar ao Dashboard/i })).toHaveAttribute('href', '/');
  });

  it('deve ter um botão "Nova Busca" que leva para o dashboard', () => {
    renderComponentWithData({ data: mockApiData, query: 'Teste' });
    expect(screen.getByRole('link', { name: /Nova Busca/i })).toHaveAttribute('href', '/dashboard');
  });
});

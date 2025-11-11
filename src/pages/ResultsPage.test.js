// src/pages/ResultsPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ResultsPage from './ResultsPage';

// --- MOCKS ---
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(() => jest.fn()), // mock para o navigate()
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

// --- MOCK CONSOLE ---
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

// --- TESTES ---
describe('Componente ResultsPage', () => {
  beforeEach(() => {
    useLocation.mockClear();
  });

  it('renderiza corretamente com dados completos', () => {
    const query = 'NVIDIA RTX 5090 32GB';
    renderComponentWithData({ data: mockApiData, query });

    // Título principal (query)
    expect(screen.getByRole('heading', { name: new RegExp(query, 'i') })).toBeInTheDocument();

    // Melhor oferta (ResultCard)
    const bestCard = screen.getByTestId('mock-result-card');
    expect(bestCard).toHaveTextContent('Site: eBay');
    expect(bestCard).toHaveTextContent('Price: 500');
    expect(bestCard).toHaveTextContent('isBest: true');

    // Resultados por fonte
    expect(screen.getByTestId('mock-source-results-ebay')).toHaveTextContent('Items: 2');
    expect(screen.queryByText(/Nenhuma oferta encontrada/i)).not.toBeInTheDocument();
  });

  it('exibe aviso se não houver "overall_best_deal"', () => {
    renderComponentWithData({ data: mockApiDataNoBestDeal, query: 'Teste' });

    // Alert de aviso
    const alert = screen.getByRole('alert');
    expect(alert).toHaveTextContent(/Não foi possível determinar a melhor oferta geral/i);

    // SourceResults renderizado
    expect(screen.getByTestId('mock-source-results-ebay')).toBeInTheDocument();

    // Sem card de melhor oferta
    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();
  });

  it('exibe mensagem se nenhuma fonte retornar resultados', () => {
    renderComponentWithData({ data: mockApiDataNoResults, query: 'Nada' });

    // Sem melhor oferta
    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();

    // Nenhum SourceResults renderizado
    expect(screen.queryByTestId(/mock-source-results-/i)).not.toBeInTheDocument();

    // Mensagem de ausência de ofertas
    expect(screen.getByText(/Nenhuma oferta encontrada/i)).toBeInTheDocument();
  });

  it('exibe erro se os dados não forem passados corretamente pela navegação', () => {
    useLocation.mockReturnValue({ state: null });
    render(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    // Ajustado para texto exato do Alert no componente
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(/Erro: Não foi possível carregar os dados da comparação/i);

    // Botão de retorno presente
    const voltarBtn = screen.getByRole('button', { name: /Voltar ao Dashboard/i });
    expect(voltarBtn).toBeInTheDocument();
  });

  it('botão "Nova Busca" está presente e acionável', async () => {
    const mockNavigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockReturnValue(mockNavigate);

    renderComponentWithData({ data: mockApiData, query: 'Teste' });

    const novaBuscaBtn = screen.getByRole('button', { name: /Nova Busca/i });
    expect(novaBuscaBtn).toBeInTheDocument();

    await userEvent.click(novaBuscaBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

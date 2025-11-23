// src/pages/ResultsPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import ResultsPage from './ResultsPage';

// --- MOCKS ---
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: () => mockNavigate,
}));

// MOCK ATUALIZADO: Reflete as props reais que o ResultsPage passa agora (title, seller)
jest.mock('../components/ResultsCard', () => (props) => (
  <div data-testid="mock-result-card">
    Mock ResultCard - Title: {props.title}, Seller: {props.seller}, Price: {props.price}, isBest: {props.isBestPrice ? 'true' : 'false'}
  </div>
));

jest.mock('../components/SourceResults', () => (props) => (
  <div data-testid={`mock-source-results-${props.sourceName}`}>
    Mock SourceResults - Source: {props.sourceName}, Items: {props.items ? props.items.length : 0}
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
      { title: 'NVIDIA RTX 5090 - eBay', price_brl: 14000, seller: 'BestSeller', link: 'http://ebay.com' }
    ],
    amazon: [
      { title: 'NVIDIA RTX 5090 - Amazon', price_brl: 15000, seller: 'Amazon US', link: 'http://amazon.com' }
    ]
  },
  overall_best_deal: {
    title: 'NVIDIA RTX 5090 - eBay',
    price_brl: 14000,
    seller: 'BestSeller', // Agora temos vendedor no best deal
    source: 'eBay',
    link: 'http://ebay.com'
  }
};

const mockApiDataNoResults = {
  results_by_source: { ebay: [], amazon: [] },
  overall_best_deal: null
};

// --- HELPER ---
const renderComponentWithData = (stateData) => {
  useLocation.mockReturnValue({ state: stateData });
  return render(
    <MemoryRouter>
      <ResultsPage />
    </MemoryRouter>
  );
};

describe('Componente ResultsPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renderiza corretamente com dados válidos', () => {
    renderComponentWithData({ data: mockApiData, query: 'Teste GPU' });

    // Verifica título da página
    expect(screen.getByText(/Resultados para: "Teste GPU"/i)).toBeInTheDocument();

    // Verifica título da seção de destaque (AGORA INCLUI A FONTE)
    expect(screen.getByText(/Melhor Preço Encontrado no eBay/i)).toBeInTheDocument();

    // Verifica se o ResultCard de destaque foi renderizado com os dados corretos
    const bestCard = screen.getByTestId('mock-result-card');
    expect(bestCard).toHaveTextContent('Title: NVIDIA RTX 5090 - eBay');
    expect(bestCard).toHaveTextContent('Seller: BestSeller');
    expect(bestCard).toHaveTextContent('Price: 14000');
    expect(bestCard).toHaveTextContent('isBest: true');

    // Verifica se as listas de resultados (SourceResults) foram renderizadas
    expect(screen.getByTestId('mock-source-results-ebay')).toHaveTextContent('Items: 1');
    expect(screen.getByTestId('mock-source-results-amazon')).toHaveTextContent('Items: 1');
  });

  it('renderiza mensagem quando não há resultados', () => {
    renderComponentWithData({ data: mockApiDataNoResults, query: 'Nada' });

    // Sem melhor oferta (renderiza alerta de aviso)
    expect(screen.getByText(/Não foi possível determinar a melhor oferta geral/i)).toBeInTheDocument();
    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();

    // Nenhum SourceResults renderizado com itens
    expect(screen.queryByTestId(/mock-source-results-/i)).not.toBeInTheDocument();

    // Mensagem de ausência de ofertas no final da página
    expect(screen.getByText(/Nenhuma oferta encontrada nas lojas pesquisadas/i)).toBeInTheDocument();
  });

  it('exibe erro se os dados não forem passados corretamente pela navegação (state null)', () => {
    useLocation.mockReturnValue({ state: null });
    render(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    // Texto exato do Alert de erro
    const errorAlert = screen.getByRole('alert');
    expect(errorAlert).toHaveTextContent(/Erro: Dados da comparação não encontrados/i);

    // Botão de retorno presente
    const voltarBtn = screen.getByRole('button', { name: /Voltar ao Dashboard/i });
    expect(voltarBtn).toBeInTheDocument();
  });

  it('botão "Nova Busca" está presente e acionável', async () => {
    const user = userEvent.setup();
    renderComponentWithData({ data: mockApiData, query: 'Teste' });

    const novaBuscaBtn = screen.getByRole('button', { name: /Nova Busca/i });
    expect(novaBuscaBtn).toBeInTheDocument();

    await user.click(novaBuscaBtn);
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});
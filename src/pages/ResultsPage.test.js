import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResultsPage from './ResultsPage';

// --- Mock dos módulos React Router ---
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

// --- Mock da API ---
jest.mock('../services/api');

// --- Mock dos componentes usados no layout ---
jest.mock('../components/ResultsCard', () => {
  return function MockResultCard({ title, priceOriginal, isBestPrice }) {
    return (
      <div data-testid="result-card">
        <span>{title}</span>
        <span>{priceOriginal}</span>
        {isBestPrice && <span>Melhor Preço</span>}
      </div>
    );
  };
});

jest.mock('../components/SourceResults', () => {
  return function MockSourceResults({ sourceName, items }) {
    return (
      <div data-testid={`source-results-${sourceName}`}>
        <h3>{sourceName}</h3>
        <span>{`${items.length} items`}</span>
      </div>
    );
  };
});

jest.mock('../components/AppHeader', () => {
  return function MockAppHeader() {
    return <header data-testid="app-header">Header</header>;
  };
});

jest.mock('../components/AppFooter', () => {
  return function MockAppFooter() {
    return <footer data-testid="app-footer">Footer</footer>;
  };
});

// ---------------------------------------------------------------------------
//                            TESTES PRINCIPAIS
// ---------------------------------------------------------------------------

describe('ResultsPage - TDD Tests', () => {
  const mockNavigate = jest.fn();

  const mockComparisonData = {
    current_exchange_rate: 5.45,
    exchange_rate_timestamp: '2024-01-15T10:30:00Z',
    overall_best_deal: {
      source: 'eBay',
      title: 'Produto Teste',
      link: 'https://example.com/product',
      seller_username: 'vendedor_teste',
      seller_rating: 4.8,
      price_original: 100,
      currency_original: 'USD',
      price_brl: 545,
    },
    results_by_source: {
      eBay: [
        { title: 'Produto 1', price_original: 100, price_brl: 545 },
        { title: 'Produto 2', price_original: 120, price_brl: 654 },
      ],
      amazon: [
        { title: 'Produto 3', price_original: 600, price_brl: 600 },
      ],
    },
  };

  // Reset mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  const renderWithRouter = (component) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

  // -------------------------------------------------------------------------
  //                         Renderização Inicial
  // -------------------------------------------------------------------------

  describe('Renderização Inicial', () => {
    test('deve renderizar header e footer', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('app-footer')).toBeInTheDocument();
    });

    test('deve exibir título com query de busca', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Nintendo Switch' },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Resultados para: "Nintendo Switch"/i)
      ).toBeInTheDocument();
    });

    test('deve usar "Busca" como fallback quando query está ausente', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Resultados para: "Busca"/i)
      ).toBeInTheDocument();
    });

    test('deve renderizar botão "Nova Busca"', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByRole('button', { name: /nova busca/i })).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  //                             Cotação do dólar
  // -------------------------------------------------------------------------

  describe('Cotação do dólar', () => {
    test('deve exibir a cotação correta', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Dólar Comercial/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 5\.4500/i)).toBeInTheDocument();
    });

    test('deve exibir horário da cotação', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      const times = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
      expect(times.length).toBeGreaterThan(0);
    });

    test('deve exibir "---" quando cotação indisponível', () => {
      const data = { ...mockComparisonData };
      delete data.current_exchange_rate;

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/R\$ ---/i)).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  //                             Melhor Oferta
  // -------------------------------------------------------------------------

  describe('Melhor Oferta', () => {
    test('deve exibir melhor oferta quando presente', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Melhor Preço Encontrado no eBay/i)).toBeInTheDocument();
      expect(screen.getByTestId('result-card')).toBeInTheDocument();
    });

    test('deve exibir aviso quando não existe melhor oferta', () => {
      const data = { ...mockComparisonData, overall_best_deal: null };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Não foi possível determinar a melhor oferta geral/i)
      ).toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  //                       Resultados por loja / fonte
  // -------------------------------------------------------------------------

  describe('Resultados por Fonte', () => {
    test('deve renderizar todas fontes com ofertas', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('source-results-eBay')).toBeInTheDocument();
      expect(screen.getByTestId('source-results-amazon')).toBeInTheDocument();
    });

    test('deve mostrar contagem correta de itens por loja', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText('2 items')).toBeInTheDocument();
      expect(screen.getByText('1 items')).toBeInTheDocument();
    });

    test('deve exibir aviso quando nenhuma loja retorna resultados', () => {
      const data = {
        ...mockComparisonData,
        overall_best_deal: null,
        results_by_source: { eBay: [], amazon: [] },
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Nenhuma oferta encontrada nas lojas pesquisadas/i)
      ).toBeInTheDocument();
    });

    test('não deve renderizar loja sem itens', () => {
      const data = {
        ...mockComparisonData,
        results_by_source: { eBay: mockComparisonData.results_by_source.eBay, amazon: [] },
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('source-results-eBay')).toBeInTheDocument();
      expect(screen.queryByTestId('source-results-amazon')).not.toBeInTheDocument();
    });
  });

  // -------------------------------------------------------------------------
  //                             Navegação
  // -------------------------------------------------------------------------

  describe('Navegação', () => {
    test('botão "Nova Busca" deve navegar para dashboard', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      fireEvent.click(screen.getByRole('button', { name: /nova busca/i }));
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  // -------------------------------------------------------------------------
  //                     Formatação de Datas / Horários
  // -------------------------------------------------------------------------

  describe('Formatação de Data/Hora', () => {
    test('deve formatar timestamp corretamente', () => {
      const ts = '2024-01-15T14:30:45Z';

      const data = {
        ...mockComparisonData,
        exchange_rate_timestamp: ts,
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data },
      });

      renderWithRouter(<ResultsPage />);

      const hours = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
      expect(hours.length).toBeGreaterThan(0);
    });
  });

  // -------------------------------------------------------------------------
  //                         Layout básico (MUI)
  // -------------------------------------------------------------------------

  describe('Responsividade e Layout', () => {
    test('deve ter container e box do MUI', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      const { container } = renderWithRouter(<ResultsPage />);

      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument();
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument();
    });
  });
});

// ---------------------------------------------------------------------------
//                      Testes de Acessibilidade
// ---------------------------------------------------------------------------

describe('ResultsPage - Testes de Acessibilidade', () => {
  const mockNavigate = jest.fn();

  const mockComparisonData = {
    current_exchange_rate: 5.45,
    overall_best_deal: {
      source: 'eBay',
      title: 'Produto Teste',
      price_original: 100,
      price_brl: 545,
    },
    results_by_source: {
      eBay: [],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
    require('react-router-dom').useLocation.mockReturnValue({
      state: { data: mockComparisonData, query: 'Teste' },
    });
  });

  const renderWithRouter = (component) =>
    render(<BrowserRouter>{component}</BrowserRouter>);

  test('botões devem ter texto descritivo', () => {
    renderWithRouter(<ResultsPage />);

    expect(
      screen.getByRole('button', { name: /nova busca/i })
    ).toBeInTheDocument();
  });

  test('deve ter título h1 estruturado', () => {
    renderWithRouter(<ResultsPage />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toContain('Resultados para');
  });
});

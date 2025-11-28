import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResultsPage from './ResultsPage';

// Mock dos módulos
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: jest.fn(),
  useNavigate: jest.fn(),
}));

jest.mock('../services/api');

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
        <span>{items.length} items</span>
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
        {
          title: 'Produto 1',
          price_original: 100,
          price_brl: 545,
        },
        {
          title: 'Produto 2',
          price_original: 120,
          price_brl: 654,
        },
      ],
      'amazon': [
        {
          title: 'Produto 3',
          price_original: 600,
          price_brl: 600,
        },
      ],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    require('react-router-dom').useNavigate.mockReturnValue(mockNavigate);
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  describe('Renderização Inicial', () => {
    test('deve renderizar header e footer', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('app-header')).toBeInTheDocument();
      expect(screen.getByTestId('app-footer')).toBeInTheDocument();
    });

    test('deve exibir o título com a query de busca', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Nintendo Switch' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Resultados para: "Nintendo Switch"/i)).toBeInTheDocument();
    });

    test('deve exibir "Busca" como título padrão quando query não é fornecida', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Resultados para: "Busca"/i)).toBeInTheDocument();
    });

    test('deve renderizar botão "Nova Busca"', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      const button = screen.getByRole('button', { name: /nova busca/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Tratamento de Erros', () => {
    test('deve exibir erro quando comparisonData não existe', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: null,
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Erro: Dados da comparação não encontrados/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /voltar ao dashboard/i })).toBeInTheDocument();
    });

    test('deve navegar para dashboard ao clicar em "Voltar ao Dashboard" na página de erro', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: null,
      });

      renderWithRouter(<ResultsPage />);

      const button = screen.getByRole('button', { name: /voltar ao dashboard/i });
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Cotação do Dólar', () => {
    test('deve exibir a cotação do dólar dos dados iniciais', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Dólar Comercial:/i)).toBeInTheDocument();
      expect(screen.getByText(/R\$ 5\.4500/i)).toBeInTheDocument();
    });

    test('deve exibir horário da cotação quando disponível', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      // Verifica se algum horário é exibido (formato HH:MM:SS)
      const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });

    test('deve exibir "---" quando cotação não está disponível', () => {
      const dataWithoutRate = { ...mockComparisonData };
      delete dataWithoutRate.current_exchange_rate;

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: dataWithoutRate, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/R\$ ---/i)).toBeInTheDocument();
    });

    test('deve exibir aviso sobre conversão automática e impostos', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Valores do eBay são convertidos automaticamente/i)
      ).toBeInTheDocument();
      expect(screen.getByText(/Impostos de importação não inclusos/i)).toBeInTheDocument();
    });
  });

  describe('Melhor Oferta', () => {
    test('deve exibir seção de melhor preço quando disponível', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText(/Melhor Preço Encontrado no eBay/i)).toBeInTheDocument();
      expect(screen.getByTestId('result-card')).toBeInTheDocument();
    });

    test('deve passar isBestPrice=true para o card da melhor oferta', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText('Melhor Preço')).toBeInTheDocument();
    });

    test('deve exibir aviso quando melhor oferta não está disponível', () => {
      const dataWithoutBestDeal = { ...mockComparisonData, overall_best_deal: null };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: dataWithoutBestDeal, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Não foi possível determinar a melhor oferta geral/i)
      ).toBeInTheDocument();
    });
  });

  describe('Resultados por Fonte', () => {
    test('deve renderizar resultados de todas as fontes disponíveis', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('source-results-eBay')).toBeInTheDocument();
      expect(screen.getByTestId('source-results-amazon')).toBeInTheDocument();
    });

    test('deve exibir contagem correta de itens por fonte', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByText('2 items')).toBeInTheDocument(); // eBay
      expect(screen.getByText('1 items')).toBeInTheDocument(); // amazon
    });

    test('deve exibir mensagem quando nenhuma oferta é encontrada', () => {
      const dataWithoutResults = {
        ...mockComparisonData,
        overall_best_deal: null,
        results_by_source: {
          eBay: [],
          'amazon': [],
        },
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: dataWithoutResults, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(
        screen.getByText(/Nenhuma oferta encontrada nas lojas pesquisadas/i)
      ).toBeInTheDocument();
    });

    test('não deve renderizar fontes sem resultados', () => {
      const dataWithPartialResults = {
        ...mockComparisonData,
        results_by_source: {
          eBay: mockComparisonData.results_by_source.eBay,
          'amazon': [],
        },
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: dataWithPartialResults, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      expect(screen.getByTestId('source-results-eBay')).toBeInTheDocument();
      expect(screen.queryByTestId('source-results-amazon')).not.toBeInTheDocument();
    });
  });

  describe('Navegação', () => {
    test('deve navegar para dashboard ao clicar em "Nova Busca"', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      const button = screen.getByRole('button', { name: /nova busca/i });
      fireEvent.click(button);

      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  describe('Formatação de Data/Hora', () => {
    test('deve formatar timestamp corretamente', () => {
      const specificTimestamp = '2024-01-15T14:30:45Z';
      const dataWithSpecificTime = {
        ...mockComparisonData,
        exchange_rate_timestamp: specificTimestamp,
      };

      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: dataWithSpecificTime, query: 'Teste' },
      });

      renderWithRouter(<ResultsPage />);

      // Verifica se há um horário formatado (HH:MM:SS)
      const timeElements = screen.getAllByText(/\d{2}:\d{2}:\d{2}/);
      expect(timeElements.length).toBeGreaterThan(0);
    });
  });

  describe('Responsividade e Layout', () => {
    test('deve ter estrutura básica de layout (Container, Box)', () => {
      require('react-router-dom').useLocation.mockReturnValue({
        state: { data: mockComparisonData, query: 'Teste' },
      });

      const { container } = renderWithRouter(<ResultsPage />);

      // Verifica se há elementos de layout do MUI
      expect(container.querySelector('.MuiContainer-root')).toBeInTheDocument();
      expect(container.querySelector('.MuiBox-root')).toBeInTheDocument();
    });
  });
});

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

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  test('botões devem ter texto descritivo', () => {
    renderWithRouter(<ResultsPage />);

    expect(screen.getByRole('button', { name: /nova busca/i })).toBeInTheDocument();
    // Removido o teste do botão de atualizar cotação
  });

  test('deve ter headings hierárquicos corretos', () => {
    renderWithRouter(<ResultsPage />);

    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent).toContain('Resultados para:');
  });
});
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HistoryPage from './HistoryPage';
import { getProductHistory } from '../services/api';

// -------------------------------------------------------------------------
// 1. Mocks
// -------------------------------------------------------------------------

// Mock do serviço de API para controlarmos as respostas (sucesso/erro)
jest.mock('../services/api');

// Mock dos componentes de Layout (para isolar o teste na HistoryPage)
jest.mock('../components/AppHeader', () => () => <div data-testid="app-header">Header</div>);
jest.mock('../components/AppFooter', () => () => <div data-testid="app-footer">Footer</div>);

// Mock do Recharts:
// Gráficos geralmente quebram testes unitários (exigem SVGs reais e ResizeObserver).
// Substituímos por divs simples para verificar apenas se eles foram chamados.
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => <div data-testid="responsive-container">{children}</div>,
  LineChart: ({ children }) => <div data-testid="line-chart">{children}</div>,
  Line: () => null,
  XAxis: () => null,
  YAxis: () => null,
  CartesianGrid: () => null,
  Tooltip: () => null,
  Legend: () => null,
}));

// -------------------------------------------------------------------------
// 2. Testes
// -------------------------------------------------------------------------

describe('HistoryPage Component', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve renderizar a estrutura inicial corretamente', () => {
    render(<HistoryPage />);

    // Verifica Títulos
    expect(screen.getByText('Histórico de Preços')).toBeInTheDocument();
    expect(screen.getByText('Acompanhe a evolução dos preços nos últimos 30 dias')).toBeInTheDocument();
    
    // Verifica se o dropdown (Select) está presente
    // O MUI Select renderiza um input hidden ou label associado
    expect(screen.getByLabelText(/Selecione a GPU/i)).toBeInTheDocument();
  });

  it('deve exibir loading e depois o gráfico ao selecionar uma GPU com sucesso', async () => {
    // Preparar dados de mock
    const mockResponse = {
      product_name: 'NVIDIA RTX 4080 Test',
      history: [
        { date: '2023-10-01T10:00:00', source: 'Amazon', price_brl: 5000, exchange_rate: 5.0 },
        { date: '2023-10-02T10:00:00', source: 'eBay', price_brl: 4800, exchange_rate: 5.0 }
      ]
    };
    getProductHistory.mockResolvedValueOnce(mockResponse);

    render(<HistoryPage />);

    // Simular interação do usuário com o Select do MUI
    // 1. Clicar no botão do select para abrir as opções
    const selectButton = screen.getByRole('combobox', { name: /Selecione a GPU/i });
    fireEvent.mouseDown(selectButton);

    // 2. Clicar em uma das opções que sabemos que existe no array GPU_OPTIONS do componente
    const option = screen.getByText('NVIDIA RTX 4080 Super 16GB');
    fireEvent.click(option);

    // Verificar estado de Loading
    expect(screen.getByText('Carregando...')).toBeInTheDocument();

    // Aguardar a promessa resolver e o loading sumir
    await waitFor(() => {
      expect(screen.queryByText('Carregando...')).not.toBeInTheDocument();
    });

    // Verificações finais de Sucesso
    expect(getProductHistory).toHaveBeenCalledWith('NVIDIA RTX 4080 Super 16GB', 30);
    expect(screen.getByText('Evolução de Preços')).toBeInTheDocument();
    expect(screen.getByText('NVIDIA RTX 4080 Test')).toBeInTheDocument(); // Nome vindo do mock
    
    // Verifica se o gráfico foi "renderizado" (pelo nosso mock)
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });

  it('deve exibir mensagem de erro quando a API falhar', async () => {
    getProductHistory.mockRejectedValueOnce(new Error('Erro de conexão'));

    render(<HistoryPage />);

    // Abrir Select
    const selectButton = screen.getByRole('combobox', { name: /Selecione a GPU/i });
    fireEvent.mouseDown(selectButton);

    // Selecionar Opção
    const option = screen.getByText('NVIDIA RTX 5090 32GB');
    fireEvent.click(option);

    // Aguardar mensagem de erro
    await waitFor(() => {
      expect(screen.getByText('Erro ao buscar histórico. Tente novamente mais tarde.')).toBeInTheDocument();
    });

    // Garante que o gráfico NÃO foi renderizado
    expect(screen.queryByTestId('line-chart')).not.toBeInTheDocument();
  });

  it('deve informar se nenhum histórico foi encontrado (lista vazia)', async () => {
    const mockResponseEmpty = { history: [] };
    getProductHistory.mockResolvedValueOnce(mockResponseEmpty);

    render(<HistoryPage />);

    // Abrir Select e escolher
    const selectButton = screen.getByRole('combobox', { name: /Selecione a GPU/i });
    fireEvent.mouseDown(selectButton);
    const option = screen.getByText('Intel Arc A770 16GB');
    fireEvent.click(option);

    await waitFor(() => {
      expect(screen.getByText('Nenhum histórico encontrado para este produto.')).toBeInTheDocument();
    });
  });

  it('deve alternar entre moedas BRL e USD quando o gráfico já estiver visível', async () => {
    // Setup inicial com dados carregados
    getProductHistory.mockResolvedValueOnce({
        product_name: 'GPU Test',
        history: [{ date: '2023-10-01', source: 'Amazon', price_brl: 1000 }]
    });

    render(<HistoryPage />);

    // Seleciona GPU para carregar gráfico
    fireEvent.mouseDown(screen.getByRole('combobox'));
    fireEvent.click(screen.getByText('AMD Radeon RX 7900 XT 20GB'));

    await waitFor(() => screen.getByText('Evolução de Preços'));

    // Busca botões de toggle (BRL e USD)
    const btnBrl = screen.getByRole('button', { name: /R\$ \(BRL\)/i });
    const btnUsd = screen.getByRole('button', { name: /USD/i });

    // Por padrão BRL deve estar selecionado (pressionado)
    expect(btnBrl).toHaveAttribute('aria-pressed', 'true');
    expect(btnUsd).toHaveAttribute('aria-pressed', 'false');

    // Clica em USD
    fireEvent.click(btnUsd);

    // Verifica mudança de estado
    expect(btnUsd).toHaveAttribute('aria-pressed', 'true');
    expect(btnBrl).toHaveAttribute('aria-pressed', 'false');
  });
});
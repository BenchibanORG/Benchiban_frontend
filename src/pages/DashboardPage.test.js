// src/pages/DashboardPage.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { getProductComparison } from '../services/api';

// --- MOCKS DE DEPENDÊNCIAS ---

// 1. Mock da API
jest.mock('../services/api');

// 2. Mock do Router (useNavigate)
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// 3. Mock dos Componentes Filhos (Para isolar o teste do Dashboard)
jest.mock('../components/AppHeader', () => () => <div data-testid="app-header">Header</div>);
jest.mock('../components/HeroSection', () => () => <div data-testid="hero-section">Hero</div>);
jest.mock('../components/HowItWorks', () => () => <div data-testid="how-it-works">HowItWorks</div>);
jest.mock('../components/AppFooter', () => () => <div data-testid="app-footer">Footer</div>);

// 4. Mock do GpuCard (Simplificado para teste de clique)
jest.mock('../components/GpuCard', () => (props) => (
  <div
    data-testid={`gpu-card-${props.name}`}
    onClick={props.onClick}
    style={props.sx}
  >
    {props.name}
  </div>
));

// 5. Mock das Imagens (Evita erro de import de arquivo estático no Jest)
jest.mock('../assets/images/rtx5090.jpg', () => 'rtx5090.jpg');
jest.mock('../assets/images/rtxa6000.jpg', () => 'rtxa6000.jpg');
jest.mock('../assets/images/amdw7900.jpg', () => 'amdw7900.jpg');

// --- DADOS DE TESTE ---
// Devem corresponder aos nomes usados no DashboardPage.js
const gpuNames = [
  'NVIDIA RTX 5090 32GB',
  'NVIDIA RTX A6000 48GB',
  'AMD Radeon PRO W7900 48GB'
];

const mockApiResponse = {
  results_by_source: { ebay: [{ title: 'Mock Item', price_brl: 100 }] },
  overall_best_deal: { title: 'Mock Item', price_brl: 100 },
};

// --- SUÍTE DE TESTES ---
describe('Componente DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getProductComparison.mockResolvedValue(mockApiResponse);
  });

  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
  };

  it('renderiza corretamente os componentes principais da página', () => {
    renderComponent();

    // Verifica se os componentes de layout estão presentes
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByTestId('how-it-works')).toBeInTheDocument();
    expect(screen.getByTestId('app-footer')).toBeInTheDocument();
    
    // Verifica o título principal
    expect(screen.getByText('Selecione uma Placa de Vídeo')).toBeInTheDocument();
  });

  it('renderiza todos os cards de GPU com suas tags', () => {
    renderComponent();

    gpuNames.forEach(name => {
      // Verifica se o card existe
      expect(screen.getByTestId(`gpu-card-${name}`)).toBeInTheDocument();
    });

    // Verifica se as tags (Chips) estão sendo renderizadas
    expect(screen.getByText('Para Entusiastas')).toBeInTheDocument();
    expect(screen.getByText('Profissional')).toBeInTheDocument();
    expect(screen.getByText('Melhor Custo-Benefício')).toBeInTheDocument();
  });

  it('navega para a página de resultados ao clicar em um card', async () => {
    const user = {}; // Simula user event se necessário, mas fireEvent funciona bem aqui
    renderComponent();

    const targetGpuName = gpuNames[0];
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    // Simula clique no card
    fireEvent.click(cardElement);

    // Verifica se o loading apareceu (opcional, pois é muito rápido)
    expect(screen.getByText(`Buscando as melhores ofertas para ${targetGpuName}...`)).toBeInTheDocument();

    await waitFor(() => {
      // Verifica chamada da API
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
      
      // Verifica navegação com os dados corretos
      expect(mockNavigate).toHaveBeenCalledWith('/results', {
        state: { data: mockApiResponse, query: targetGpuName },
      });
    });
  });

  it('exibe mensagem de erro se a API falhar', async () => {
    const errorMessage = 'Erro de conexão simulado';
    getProductComparison.mockRejectedValue({
      response: { data: { detail: errorMessage } },
    });

    renderComponent();

    const targetGpuName = gpuNames[1];
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    fireEvent.click(cardElement);

    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
    });

    // Verifica se o alerta de erro apareceu
    expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
    
    // Garante que não navegou
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não deve permitir múltiplos cliques durante carregamento', async () => {
    // Simula uma API lenta (200ms)
    getProductComparison.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockApiResponse), 200))
    );

    renderComponent();

    const targetGpuName = gpuNames[0];
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    // Clica duas vezes rapidamente
    fireEvent.click(cardElement);
    fireEvent.click(cardElement);

    await waitFor(() => {
      // Deve ter chamado a API apenas uma vez
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      // E navegado apenas uma vez
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });
});
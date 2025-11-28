import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { getProductComparison } from '../services/api';

// --- MOCKS ---
jest.mock('../services/api');
const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mocks visuais para simplificar o teste (evita renderizar filhos complexos)
jest.mock('../components/AppHeader', () => () => <div data-testid="app-header">Header Mock</div>);
jest.mock('../components/HeroSection', () => () => <div data-testid="hero-section">Hero Mock</div>);
jest.mock('../components/HowItWorks', () => () => <div data-testid="how-it-works">HowItWorks Mock</div>);
jest.mock('../components/AppFooter', () => () => <div data-testid="app-footer">Footer Mock</div>);

// Mock do GpuCard para facilitar cliques e verificação de props
jest.mock('../components/GpuCard', () => ({ name, description, techInfo, onClick }) => (
  <div data-testid={`gpu-card-${name}`} onClick={onClick}>
    {name} | {description} | Tech: {techInfo || 'none'}
  </div>
));

// Mocks de imagens para evitar erros de importação do Jest
jest.mock('../assets/images/rtx5090.jpg', () => 'mock-rtx5090');
jest.mock('../assets/images/rtxa6000.jpg', () => 'mock-rtxa6000');
jest.mock('../assets/images/amdw7900.jpg', () => 'mock-amdw7900');
jest.mock('../assets/images/amdrx7600xt.png', () => 'mock-amdrx7600xt');
jest.mock('../assets/images/amdrx7900xt.png', () => 'mock-amdrx7900xt');
jest.mock('../assets/images/amdrx7900xtx.png', () => 'mock-amdrx7900xtx');
jest.mock('../assets/images/intelarca770.png', () => 'mock-intelarca770');
jest.mock('../assets/images/rtx4070tisuper.png', () => 'mock-rtx4070tisuper');
jest.mock('../assets/images/rtx4080super.png', () => 'mock-rtx4080super');
jest.mock('../assets/images/rtx6000ada.png', () => 'mock-rtx6000ada');

const mockApiResponse = {
  results_by_source: { kabum: [{ title: 'Mock', price_brl: 5000 }] },
  overall_best_deal: { title: 'Mock', price_brl: 5000 },
};

describe('DashboardPage', () => {
  // Configuração pré-teste
  beforeEach(() => {
    jest.clearAllMocks();
    getProductComparison.mockResolvedValue(mockApiResponse);
  });

  const renderPage = () => render(
    <BrowserRouter>
      <DashboardPage />
    </BrowserRouter>
  );

  it('renderiza componentes principais e todos os 10 cards iniciais', () => {
    renderPage();

    // Verifica elementos estáticos
    expect(screen.getByTestId('app-header')).toBeInTheDocument();
    expect(screen.getByTestId('hero-section')).toBeInTheDocument();
    expect(screen.getByText(/Escolha sua GPU/i)).toBeInTheDocument(); // Texto atualizado conforme arquivo DashboardPage.js
    
    // Verifica filtros
    expect(screen.getByLabelText(/Categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Quantidade de VRAM/i)).toBeInTheDocument();

    // Verifica se os 10 cards foram renderizados
    expect(screen.getAllByTestId(/gpu-card-/).length).toBe(10);
    // Verifica primeiro e último para garantir ordem/dados
    expect(screen.getByTestId('gpu-card-NVIDIA RTX A6000 48GB')).toBeInTheDocument();
    expect(screen.getByTestId('gpu-card-Intel Arc A770 16GB')).toBeInTheDocument();
  });

  it('filtra cards por categoria "Profissional"', async () => {
    const user = userEvent.setup();
    renderPage();

    // Abre o select e clica na opção
    await user.click(screen.getByLabelText(/Categoria/i));
    await user.click(screen.getByRole('option', { name: 'Profissional' }));

    const cards = screen.getAllByTestId(/gpu-card-/);
    // Esperamos 4 placas profissionais (A6000, 6000 Ada, W7900, 5090)
    expect(cards.length).toBe(4);
    expect(screen.getByTestId('gpu-card-NVIDIA RTX A6000 48GB')).toBeInTheDocument();
    
    // Garante que uma placa de outra categoria SUMIU
    expect(screen.queryByTestId('gpu-card-Intel Arc A770 16GB')).not.toBeInTheDocument();
  });

  it('filtra cards por marca "AMD"', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByLabelText(/Marca/i));
    await user.click(screen.getByRole('option', { name: 'AMD' }));

    const cards = screen.getAllByTestId(/gpu-card-/);
    // Esperamos 4 placas AMD (W7900, 7900 XTX, 7900 XT, 7600 XT)
    expect(cards.length).toBe(4);
    expect(screen.getByTestId('gpu-card-AMD Radeon PRO W7900 48GB')).toBeInTheDocument();
  });

  it('filtra cards por VRAM "48GB"', async () => {
    const user = userEvent.setup();
    renderPage();

    await user.click(screen.getByLabelText(/Quantidade de VRAM/i));
    await user.click(screen.getByRole('option', { name: '48GB' }));

    const cards = screen.getAllByTestId(/gpu-card-/);
    // Esperamos 3 placas de 48GB
    expect(cards.length).toBe(3);
  });

  it('restaura a lista completa ao selecionar filtro "Todas"', async () => {
    const user = userEvent.setup();
    renderPage();

    // 1. Aplica filtro AMD
    await user.click(screen.getByLabelText(/Marca/i));
    await user.click(screen.getByRole('option', { name: 'AMD' }));
    expect(screen.getAllByTestId(/gpu-card-/).length).toBe(4);

    // 2. Volta para Todas
    await user.click(screen.getByLabelText(/Marca/i));
    await user.click(screen.getByRole('option', { name: 'Todas' }));

    // 3. Deve ter 10 novamente
    expect(screen.getAllByTestId(/gpu-card-/).length).toBe(10);
  });

  it('exibe mensagem quando nenhum card corresponde aos filtros', async () => {
    const user = userEvent.setup();
    renderPage();

    // Filtro Marca: Intel (só tem 16GB)
    await user.click(screen.getByLabelText(/Marca/i));
    await user.click(screen.getByRole('option', { name: 'Intel' }));

    // Filtro VRAM: 48GB (Intel não tem 48GB)
    await user.click(screen.getByLabelText(/Quantidade de VRAM/i));
    await user.click(screen.getByRole('option', { name: '48GB' }));

    // Não deve achar nada
    expect(screen.queryByTestId(/gpu-card-/)).not.toBeInTheDocument();
    expect(screen.getByText(/Nenhuma placa encontrada com esses filtros/i)).toBeInTheDocument();
  });

  it('exibe mensagem de erro se a API falhar', async () => {
    const user = userEvent.setup();
    // Simula erro na API
    getProductComparison.mockRejectedValueOnce({
      response: { data: { detail: 'Erro simulado na API' } },
    });

    renderPage();

    const card = screen.getByTestId('gpu-card-AMD Radeon PRO W7900 48GB');
    await user.click(card);

    // Aguarda o alerta de erro aparecer
    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveTextContent(/Erro simulado na API/i);
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it('impede múltiplos cliques enquanto carrega (debounce/loading state)', async () => {
    const user = userEvent.setup();
    
    // API demora 100ms para responder
    getProductComparison.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 100)));

    renderPage();

    const card = screen.getByTestId('gpu-card-NVIDIA RTX A6000 48GB');
    
    // Clica duas vezes rapidamente
    // Nota: não usamos await no primeiro para simular clique rápido antes da resposta
    user.click(card); 
    user.click(card);

    // Aguarda a finalização
    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1); // Só deve chamar 1 vez
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it('passa techInfo corretamente para o componente GpuCard', () => {
    renderPage();

    const card = screen.getByTestId('gpu-card-NVIDIA RTX 5090 32GB');
    // Verifica se o texto técnico do arquivo DashboardPage.js está sendo passado
    expect(card).toHaveTextContent(/Tech: Blackwell/i); 
  });
});
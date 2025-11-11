import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import { getProductComparison } from '../services/api';

// --- MOCKS ---
jest.mock('../services/api');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('../components/GpuCard', () => (props) => (
  <div
    data-testid={`gpu-card-${props.name}`}
    onClick={props.onClick}
    style={props.sx}
  >
    {props.name}
  </div>
));

// --- MOCK DATA ---
const mockGpuData = [
  { name: 'NVIDIA RTX 5090 32GB' },
  { name: 'NVIDIA RTX A6000 48GB' },
  { name: 'AMD Radeon PRO W7900 48GB' },
];

const mockApiResponse = {
  results_by_source: { ebay: [{ title: 'Mock Item', price_brl: 100 }] },
  overall_best_deal: { title: 'Mock Item', price_brl: 100 },
};

// --- TESTES ---
describe('Componente DashboardPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getProductComparison.mockResolvedValue(mockApiResponse);
  });

  const renderComponent = () => {
    render(
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar o header, o botão "Sair" e os cards de GPU corretamente', () => {
    renderComponent();

    // Novo título da seção hero
    expect(
      screen.getByRole('heading', { name: /Encontre as Melhores Ofertas/i })
    ).toBeInTheDocument();

    // Subtítulo
    expect(
      screen.getByText(/Compare preços em tempo real de placas de vídeo de alto desempenho/i)
    ).toBeInTheDocument();

    // Botão de logout
    expect(screen.getByRole('button', { name: /Sair/i })).toBeInTheDocument();

    // Cards renderizados (mockados)
    mockGpuData.forEach((gpu) => {
      expect(screen.getByTestId(`gpu-card-${gpu.name}`)).toBeInTheDocument();
    });
  });

  it('deve chamar a API e navegar ao clicar em um card com sucesso', async () => {
    const user = userEvent.setup();
    renderComponent();

    const targetGpuName = mockGpuData[0].name;
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    await user.click(cardElement);

    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
    });

    expect(mockNavigate).toHaveBeenCalledWith('/results', {
      state: { data: mockApiResponse, query: targetGpuName },
    });
  });

  it('deve exibir mensagem de erro se a API falhar', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Falha na API';
    getProductComparison.mockRejectedValue({
      response: { data: { detail: errorMessage } },
    });

    renderComponent();

    const targetGpuName = mockGpuData[1].name;
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    await user.click(cardElement);

    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não deve permitir múltiplos cliques durante carregamento', async () => {
    const user = userEvent.setup();
    getProductComparison.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(mockApiResponse), 200))
    );

    renderComponent();

    const targetGpuName = mockGpuData[0].name;
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    await user.click(cardElement);
    await user.click(cardElement); // clique duplo rápido

    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(mockNavigate).toHaveBeenCalledTimes(1);
    });
  });

  it('deve navegar para login ao clicar em "Sair"', async () => {
    const user = userEvent.setup();
    renderComponent();

    const logoutButton = screen.getByRole('button', { name: /Sair/i });
    await user.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});
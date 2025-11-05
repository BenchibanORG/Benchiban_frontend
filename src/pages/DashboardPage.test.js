import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter, useNavigate } from 'react-router-dom'; // Importa useNavigate
import DashboardPage from './DashboardPage';
import { getProductComparison } from '../services/api'; // Importa a função da API

// --- MOCKS ---
// Mock do serviço de API
jest.mock('../services/api'); 
// Mock do hook useNavigate
const mockNavigate = jest.fn(); // Cria uma função mock para simular a navegação
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantém as outras exportações do react-router-dom
  useNavigate: () => mockNavigate, // Sobrescreve useNavigate para retornar nossa função mock
}));
// Mock simplificado do GpuCard para focar na lógica da DashboardPage
jest.mock('../components/GpuCard', () => (props) => (
  <div data-testid={`gpu-card-${props.name}`} onClick={props.onClick} style={props.sx}>
    {props.name} - {props.description}
  </div>
));

// --- Dados Mockados ---
// CORREÇÃO: Usa os nomes EXATOS do array gpuData no componente
const mockGpuData = [ 
 { name: 'NVIDIA RTX 5090 32GB' },
 { name: 'NVIDIA RTX A6000 48GB' },
 { name: 'AMD Radeon PRO W7900 48GB' }, 
];
const mockApiResponse = { // Simula a resposta da API
  results_by_source: { ebay: [{ title: 'Mock Item', price_brl: 100 }] },
  overall_best_deal: { title: 'Mock Item', price_brl: 100 }
};


describe('Componente DashboardPage', () => {
  
  // Limpa os mocks antes de cada teste
  beforeEach(() => {
    jest.clearAllMocks();
    // Reseta o mock da API para sucesso por padrão
    getProductComparison.mockResolvedValue(mockApiResponse); 
  });

  // Função auxiliar para renderizar o componente
  const renderComponent = () => {
    render(
      <BrowserRouter> 
        <DashboardPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar o cabeçalho e os cards das GPUs corretamente', () => {
    renderComponent();
    
    expect(screen.getByRole('heading', { name: /Benchiban/i })).toBeInTheDocument();
    expect(screen.getByText(/O melhor preço de GPU em primeiro lugar!/i)).toBeInTheDocument();

    // Verifica se os cards (mockados) foram renderizados usando os nomes corretos
    mockGpuData.forEach(gpu => {
      expect(screen.getByTestId(`gpu-card-${gpu.name}`)).toBeInTheDocument();
    });
  });

  it('deve chamar a API e navegar ao clicar em um card com sucesso', async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const targetGpuName = mockGpuData[0].name; 
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    await user.click(cardElement);

    // Verifica se a API foi chamada corretamente
    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
    });

    // Verifica se a navegação ocorreu com os dados corretos
    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/results', { 
      state: { data: mockApiResponse, query: targetGpuName } 
    });

    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('deve exibir uma mensagem de erro se a chamada da API falhar', async () => {
    const user = userEvent.setup();
    const errorMessage = 'Falha na API';
    getProductComparison.mockRejectedValue({ response: { data: { detail: errorMessage } } });

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

  it('não deve permitir cliques múltiplos enquanto carrega', async () => {
    const user = userEvent.setup();
     // Simula uma API que demora um pouco para responder
    getProductComparison.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 100)));

    renderComponent();

    const targetGpuName = mockGpuData[0].name;
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);
    await user.click(cardElement);
    user.click(cardElement); 
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledTimes(1); 
    });

    expect(getProductComparison).toHaveBeenCalledTimes(1); 
  });

});
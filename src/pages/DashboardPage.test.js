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
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));
// Mock simplificado do GpuCard para focar na lógica da DashboardPage
jest.mock('../components/GpuCard', () => (props) => (
  <div data-testid={`gpu-card-${props.name}`} onClick={props.onClick} style={props.sx}>
    {props.name} - {props.description}
  </div>
));

// --- Dados Mockados ---
// A lista mockGpuData agora corresponde exatamente aos nomes usados no DashboardPage.js
const mockGpuData = [ 
 { name: 'NVIDIA GeForce RTX 5090 32GB' },
 { name: 'NVIDIA RTX A6000 48GB' },
 { name: 'NVIDIA Tesla A100 80GB GPU SXM4' },
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
      <BrowserRouter> {/* Necessário para Link/RouterLink se GpuCard usar */}
        <DashboardPage />
      </BrowserRouter>
    );
  };

  it('deve renderizar o cabeçalho e os cards das GPUs corretamente', () => {
    renderComponent();
    
    // Verifica cabeçalho
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
    
    // Usa o nome correto da GPU mockada
    const targetGpuName = mockGpuData[0].name; 
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    // Simula o clique no card
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
    // Configura o mock da API para rejeitar (simular erro)
    getProductComparison.mockRejectedValue({ response: { data: { detail: errorMessage } } });

    renderComponent();

    // Usa o nome correto da GPU mockada
    const targetGpuName = mockGpuData[1].name; 
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    // Simula o clique
    await user.click(cardElement);

    // Verifica se a API foi chamada
    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
      expect(getProductComparison).toHaveBeenCalledWith(targetGpuName);
    });
    
    // Verifica se a mensagem de erro da API é exibida
    expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
    // Verifica se a navegação NÃO ocorreu
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('não deve permitir cliques múltiplos enquanto carrega', async () => {
    const user = userEvent.setup();
     // Simula uma API que demora um pouco para responder
    getProductComparison.mockImplementation(() => new Promise(resolve => setTimeout(() => resolve(mockApiResponse), 100)));

    renderComponent();

    // Usa o nome correto da GPU mockada
    const targetGpuName = mockGpuData[0].name;
    const cardElement = screen.getByTestId(`gpu-card-${targetGpuName}`);

    // Clica duas vezes rapidamente
    await user.click(cardElement);
    await user.click(cardElement); // Segunda tentativa de clique

    // Espera a API ser chamada e verifica se foi chamada apenas UMA vez
    await waitFor(() => {
      expect(getProductComparison).toHaveBeenCalledTimes(1);
    });
     // Verifica se a navegação ocorreu apenas UMA vez
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

});
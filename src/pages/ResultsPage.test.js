import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter, useLocation } from 'react-router-dom'; // Importa MemoryRouter e useLocation
import ResultsPage from './ResultsPage';

// --- MOCKS ---
// Mock do hook useLocation para simular os dados recebidos via state
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // Mantém as outras exportações
  useLocation: jest.fn(), // Mocka useLocation
}));

// Mock dos componentes filhos para isolar o teste
jest.mock('../components/ResultsCard', () => (props) => (
  <div data-testid="mock-result-card">
    {/* Exibe as props recebidas para facilitar a verificação */}
    Mock ResultCard - Site: {props.site}, Price: {props.price}, isBest: {props.isBestPrice.toString()}
  </div>
));
jest.mock('../components/SourceResults', () => (props) => (
  <div data-testid={`mock-source-results-${props.sourceName}`}>
    Mock SourceResults - Source: {props.sourceName}, Items: {props.items.length}
  </div>
));

// --- Dados Mockados ---
const mockApiData = {
  results_by_source: {
    ebay: [
      { title: 'Item eBay 1', price_brl: 500.0, source: 'eBay', seller_username: 'seller1', seller_rating: 99, link: 'link1' },
      { title: 'Item eBay 2', price_brl: 600.0, source: 'eBay', seller_username: 'seller2', seller_rating: 98, link: 'link2' },
    ],
    mercado_livre: [], // Fonte sem resultados
  },
  overall_best_deal: { 
    title: 'Item eBay 1', price_brl: 500.0, source: 'eBay', seller_username: 'seller1', seller_rating: 99, link: 'link1' 
  }
};

const mockApiDataNoBestDeal = { // Caso sem 'overall_best_deal'
  results_by_source: {
    ebay: [ { title: 'Item eBay 1', source: 'eBay' } ],
  },
  overall_best_deal: null 
};

const mockApiDataNoResults = { // Caso sem nenhum resultado
  results_by_source: {
    ebay: [],
    mercado_livre: [],
  },
  overall_best_deal: null
};


describe('Componente ResultsPage', () => {

  // Limpa o mock de useLocation antes de cada teste
  beforeEach(() => {
    useLocation.mockClear();
  });

  // Função auxiliar para renderizar com dados específicos
  const renderComponentWithData = (stateData) => {
    useLocation.mockReturnValue({ state: stateData }); // Configura o mock de useLocation
    render(
      // MemoryRouter é necessário porque o componente usa RouterLink (no botão Voltar)
      <MemoryRouter> 
        <ResultsPage />
      </MemoryRouter>
    );
  };

  it('deve renderizar corretamente com dados completos', () => {
    const query = 'RTX 4080';
    renderComponentWithData({ data: mockApiData, query: query });

    // Verifica o título da página
    expect(screen.getByRole('heading', { name: `Resultados para: ${query}` })).toBeInTheDocument();
    
    // Verifica se o mock do ResultCard (melhor oferta) foi renderizado com dados normalizados
    const bestCard = screen.getByTestId('mock-result-card');
    expect(bestCard).toBeInTheDocument();
    // Verifica se a normalização funcionou (pegando 'source' e colocando em 'site')
    expect(bestCard).toHaveTextContent(`Site: ${mockApiData.overall_best_deal.source}`); 
    expect(bestCard).toHaveTextContent(`Price: ${mockApiData.overall_best_deal.price_brl}`);
    expect(bestCard).toHaveTextContent(`isBest: true`);

    // Verifica se o mock do SourceResults para 'ebay' foi renderizado
    const ebayResults = screen.getByTestId('mock-source-results-ebay');
    expect(ebayResults).toBeInTheDocument();
    expect(ebayResults).toHaveTextContent('Items: 2'); // Verifica se recebeu 2 itens

    // Verifica se o mock para 'mercado_livre' NÃO foi renderizado (pois a lista está vazia)
    expect(screen.queryByTestId('mock-source-results-mercado_livre')).not.toBeInTheDocument();

    // Verifica se a mensagem de "nenhuma oferta encontrada" NÃO está presente
    expect(screen.queryByText(/Nenhuma oferta encontrada/i)).not.toBeInTheDocument();
  });

  it('deve exibir aviso se não houver "overall_best_deal"', () => {
    renderComponentWithData({ data: mockApiDataNoBestDeal, query: 'Teste' });

    // Verifica se o card de melhor oferta NÃO foi renderizado
    expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();
    // Verifica se o Alert de aviso é exibido
    expect(screen.getByRole('alert')).toHaveTextContent(/Não foi possível determinar a melhor oferta geral/i);

    // Verifica se SourceResults ainda é renderizado (pois há itens no eBay)
    expect(screen.getByTestId('mock-source-results-ebay')).toBeInTheDocument();
  });

  it('deve exibir mensagem se nenhuma fonte retornar resultados', () => {
     renderComponentWithData({ data: mockApiDataNoResults, query: 'Nada' });

     // Verifica se NENHUM card ou lista de fonte foi renderizado
     expect(screen.queryByTestId('mock-result-card')).not.toBeInTheDocument();
     expect(screen.queryByTestId(/mock-source-results-/i)).not.toBeInTheDocument();

     // Verifica se a mensagem de "Nenhuma oferta encontrada" é exibida
     expect(screen.getByText(/Nenhuma oferta encontrada para esta placa de vídeo/i)).toBeInTheDocument();
  });


  it('deve exibir erro se os dados não forem passados corretamente pela navegação', () => {
    // Simula a chegada na página sem o 'state' (ex: URL digitada diretamente)
    useLocation.mockReturnValue({ state: null }); 
    render(
      <MemoryRouter>
        <ResultsPage />
      </MemoryRouter>
    );

    // Verifica se a mensagem de erro específica é exibida
    expect(screen.getByRole('alert')).toHaveTextContent(/Erro: Não foi possível carregar os dados/i);
    // Verifica se o botão de voltar está presente
    expect(screen.getByRole('link', { name: /Voltar ao Dashboard/i })).toBeInTheDocument();
  });
  
   it('deve ter um botão "Nova Busca" que leva para a raiz', () => {
    renderComponentWithData({ data: mockApiData, query: 'Teste' });
    expect(screen.getByRole('link', { name: /Nova Busca/i })).toHaveAttribute('href', '/');
  });

});
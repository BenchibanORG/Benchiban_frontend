import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ResultsPage from './ResultsPage';

// Habilita o uso de timers falsos para controlar o setTimeout
jest.useFakeTimers();

describe('ResultsPage', () => {

  it('deve exibir a tela de carregamento inicialmente', () => {
    render(
      <BrowserRouter>
        <ResultsPage />
      </BrowserRouter>
    );

    // Verifica se o título de carregamento e o spinner estão na tela
    expect(screen.getByRole('heading', { name: /buscando preços/i })).toBeInTheDocument();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('deve exibir os resultados após o tempo de carregamento', () => {
    render(
      <BrowserRouter>
        <ResultsPage />
      </BrowserRouter>
    );

    // Avança o tempo do 'setTimeout' em 3 segundos
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    // Verifica se o título principal mudou
    expect(screen.getByRole('heading', { name: /resultado da busca/i })).toBeInTheDocument();

    // Verifica se o card de "melhor preço" é exibido
    expect(screen.getByText(/melhor preço encontrado em/i)).toBeInTheDocument();
    expect(screen.getByText(/AliExpress \(China\)/i)).toBeInTheDocument();

    // Verifica se todos os 4 cards de resultado foram renderizados
    expect(screen.getByText('Newegg')).toBeInTheDocument();
    expect(screen.getByText('Mercado Livre')).toBeInTheDocument();
    expect(screen.getByText('Caseking')).toBeInTheDocument();
    expect(screen.getByText('AliExpress')).toBeInTheDocument();
  });
});
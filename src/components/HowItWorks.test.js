import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Garante os matchers como toBeInTheDocument
import HowItWorks from './HowItWorks';

describe('HowItWorks Component', () => {
  
  // 1. Teste de Renderização Básica e Título
  it('deve renderizar o título principal "Como Funciona?"', () => {
    render(<HowItWorks />);
    
    // Busca pelo título exato
    const title = screen.getByText('Como Funciona?');
    expect(title).toBeInTheDocument();
    
    // Opcional: Verifica se é um h6 conforme definido no componente
    expect(title.tagName).toBe('H6');
  });

  // 2. Teste dos Passos (Steps)
  it('deve renderizar os 3 passos com número, título e descrição', () => {
    render(<HowItWorks />);

    // Passo 1
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('Selecione')).toBeInTheDocument();
    expect(screen.getByText('Escolha a placa de vídeo que deseja pesquisar')).toBeInTheDocument();

    // Passo 2
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Compare')).toBeInTheDocument();
    expect(screen.getByText('Veja preços em diferentes marketplaces globais')).toBeInTheDocument();

    // Passo 3
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('Economize')).toBeInTheDocument();
    expect(screen.getByText('Encontre a melhor oferta convertida para BRL')).toBeInTheDocument();
  });

  // 3. Teste do Alerta
  it('deve renderizar o alerta de aviso importante', () => {
    render(<HowItWorks />);

    // Verifica se o texto "Aviso Importante:" está presente
    // Usamos regex /.../i para ignorar case sensitive e achar dentro de tags strong
    expect(screen.getByText(/Aviso Importante:/i)).toBeInTheDocument();

    // Verifica se o conteúdo crucial do aviso está presente
    expect(screen.getByText(/não possui parceria com as lojas listadas/i)).toBeInTheDocument();
    expect(screen.getByText(/analise cuidadosamente o anúncio/i)).toBeInTheDocument();
  });

  // 4. Teste de Estrutura (Grid)
  it('deve renderizar a estrutura correta de grid', () => {
    const { container } = render(<HowItWorks />);
    
    // Verifica se os elementos de Grid do Material UI estão presentes
    // O MUI renderiza classes como MuiGrid-container e MuiGrid-item
    const gridContainer = container.querySelector('.MuiGrid-container');
    const gridItems = container.querySelectorAll('.MuiGrid-item');

    expect(gridContainer).toBeInTheDocument();
    // Esperamos 3 itens de grid (um para cada passo)
    expect(gridItems).toHaveLength(3);
  });
});
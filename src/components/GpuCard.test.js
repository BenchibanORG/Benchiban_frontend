import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GpuCard from './GpuCard';

describe('GpuCard Component', () => {
  // Mock de dados para os testes
  const mockGpu = {
    name: 'GPU de Teste',
    description: 'Esta é uma descrição de teste.',
    image: 'https://picsum.photos/seed/test/300/200'
  };

  it('deve renderizar a imagem, nome e descrição da GPU corretamente', () => {
    render(
      <BrowserRouter>
        <GpuCard 
          name={mockGpu.name} 
          description={mockGpu.description} 
          image={mockGpu.image} 
        />
      </BrowserRouter>
    );
    
    // Verifica se os textos e a imagem (pelo alt text) estão na tela
    expect(screen.getByText('GPU de Teste')).toBeInTheDocument();
    expect(screen.getByText('Esta é uma descrição de teste.')).toBeInTheDocument();
    expect(screen.getByAltText('GPU de Teste')).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando o card for clicado', async () => {
    // Arrange: Preparamos uma função (mock) para o onClick
    const handleClick = jest.fn();
    const user = userEvent.setup(); // Configura o userEvent
    
    render(
      <BrowserRouter>
        <GpuCard {...mockGpu} onClick={handleClick} />
      </BrowserRouter>
    );

    // Act: Simula o usuário clicando na área do card.
    await user.click(screen.getByRole('button'));

    // Assert: Verifica se a nossa função foi chamada exatamente uma vez
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
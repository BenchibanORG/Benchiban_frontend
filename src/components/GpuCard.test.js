import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import GpuCard from './GpuCard';

describe('GpuCard Component', () => {
  const mockGpu = {
    name: 'GPU de Teste',
    description: 'Esta é uma descrição de teste.',
    image: 'https://picsum.photos/seed/test/300/200',
  };

  const mockGpuWithTech = {
    ...mockGpu,
    techInfo: 'RTX 4090 • 24GB GDDR6X • 450W',
  };

  it('deve renderizar a imagem, nome e descrição da GPU corretamente', () => {
    render(
      <BrowserRouter>
        <GpuCard {...mockGpu} />
      </BrowserRouter>
    );

    expect(screen.getByText(mockGpu.name)).toBeInTheDocument();
    expect(screen.getByText(mockGpu.description)).toBeInTheDocument();
    expect(screen.getByAltText(mockGpu.name)).toBeInTheDocument();
    // Garante que a área de techInfo não aparece quando não tem prop
    expect(screen.queryByText(/Specs:/)).not.toBeInTheDocument();
  });

  it('deve exibir as especificações técnicas quando techInfo for passado', () => {
    render(
      <BrowserRouter>
        <GpuCard {...mockGpuWithTech} />
      </BrowserRouter>
    );

    expect(screen.getByText(/Specs:/)).toBeInTheDocument();
    expect(screen.getByText(mockGpuWithTech.techInfo)).toBeInTheDocument();
  });

  it('deve chamar a função onClick quando o card for clicado', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();

    render(
      <BrowserRouter>
        <GpuCard {...mockGpu} onClick={handleClick} />
      </BrowserRouter>
    );

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
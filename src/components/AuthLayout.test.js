import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthLayout from './AuthLayout';

describe('AuthLayout', () => {
  it('deve renderizar o título e o conteúdo filho corretamente', () => {
    const testTitle = 'Título de Teste';
    const childText = 'Este é o conteúdo filho.';

    render(
      <AuthLayout title={testTitle}>
        <p>{childText}</p>
      </AuthLayout>
    );

    // Verifica se o título passado como prop está na tela
    expect(screen.getByRole('heading', { name: testTitle })).toBeInTheDocument();

    // Verifica se o conteúdo filho (children) está na tela
    expect(screen.getByText(childText)).toBeInTheDocument();
  });
});
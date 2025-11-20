import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// ------------------
// MOCKS PERMITIDOS
// ------------------

global.mockIsAuthenticated = false;

jest.mock('./components/ProtectedRoute', () => ({
  __esModule: true,
  default: ({ children }) => {
    return global.mockIsAuthenticated
      ? <div data-testid="protected">{children}</div>
      : <div data-testid="blocked">blocked</div>;
  }
}));

jest.mock('./components/PublicRoute', () => ({
  __esModule: true,
  default: ({ children }) => (
    <div data-testid="public">{children}</div>
  )
}));

// Mock das páginas
jest.mock('./pages/LoginPage', () => () => <div>LOGIN PAGE</div>);
jest.mock('./pages/RegisterPage', () => () => <div>REGISTER PAGE</div>);
jest.mock('./pages/ForgotPasswordPage', () => () => <div>FORGOT PAGE</div>);
jest.mock('./pages/ResetPasswordPage', () => () => <div>RESET PAGE</div>);
jest.mock('./pages/DashboardPage', () => () => <div>DASHBOARD PAGE</div>);
jest.mock('./pages/ResultsPage', () => () => <div>RESULTS PAGE</div>);

describe('Testes de roteamento do App', () => {

  beforeEach(() => {
    global.mockIsAuthenticated = false;
    jest.clearAllMocks();
  });

  test('Redireciona "/" para /login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('LOGIN PAGE')).toBeInTheDocument();
  });

  test('Acessar rota protegida sem login → bloqueado', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('blocked')).toBeInTheDocument();
  });

  test('Acessar rota protegida com login → permitido', () => {
    global.mockIsAuthenticated = true;

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('DASHBOARD PAGE')).toBeInTheDocument();
  });

  test('Public pages funcionam normalmente', () => {
    render(
      <MemoryRouter initialEntries={['/register']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText('REGISTER PAGE')).toBeInTheDocument();
  });
});

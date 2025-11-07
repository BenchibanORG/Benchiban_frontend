import React from 'react';
import { render, screen } from '@testing-library/react';
// Precisamos de importar useLocation para o último teste
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// --- MUDANÇA NA FORMA DE SIMULAR O LOCALSTORAGE ---
// Em vez de simular o objeto 'window', simulamos as funções que ele usa.
const mockGetItem = jest.spyOn(Storage.prototype, 'getItem');
// const mockSetItem = jest.spyOn(Storage.prototype, 'setItem'); // Não precisamos de mockar o setItem

// Limpa os mocks antes de cada teste
beforeEach(() => {
  jest.clearAllMocks();
});

// Componentes "dummy" para simular as nossas páginas
const PaginaProtegida = () => <div data-testid="pagina-protegida">Página Secreta</div>;
const PaginaLogin = () => <div>Página de Login</div>;

describe('Componente ProtectedRoute', () => {

  it('deve redirecionar para a página de login se o utilizador não estiver autenticado', () => {
    // Simula o localStorage a retornar 'null' (utilizador não logado)
    mockGetItem.mockReturnValue(null);

    render(
      <MemoryRouter initialEntries={['/dashboard']}> {/* O utilizador tenta aceder a /dashboard */}
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<PaginaProtegida />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verifica se foi redirecionado para a página de login
    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    // Verifica se a página protegida NÃO foi renderizada
    expect(screen.queryByTestId('pagina-protegida')).not.toBeInTheDocument();
    // Verifica se a função 'getItem' foi chamada
    expect(mockGetItem).toHaveBeenCalledWith('token');
  });

  it('deve renderizar o componente filho (Outlet) se o utilizador estiver autenticado', () => {
    // Simula o localStorage a retornar um token (utilizador logado)
    mockGetItem.mockReturnValue('fake-jwt-token');

    render(
      <MemoryRouter initialEntries={['/dashboard']}> {/* O utilizador tenta aceder a /dashboard */}
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<PaginaProtegida />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verifica se a página protegida FOI renderizada
    expect(screen.getByTestId('pagina-protegida')).toBeInTheDocument();
    // Verifica se NÃO foi redirecionado para a página de login
    expect(screen.queryByText('Página de Login')).not.toBeInTheDocument();
    // Verifica se a função 'getItem' foi chamada
    expect(mockGetItem).toHaveBeenCalledWith('token');
  });

  it('deve passar a mensagem de estado para a página de login ao redirecionar', () => {
    // Simula um utilizador não autenticado
    mockGetItem.mockReturnValue(null);
    
    // Componente "dummy" que lê o estado da navegação
    const PaginaLoginComEstado = () => {
      // Usamos o useLocation real aqui
      const { state } = useLocation(); 
      return <div>Página de Login: {state?.message}</div>;
    };

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route path="/login" element={<PaginaLoginComEstado />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<PaginaProtegida />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    // Verifica se a página de login contém a mensagem de erro que o ProtectedRoute envia
    expect(screen.getByText(/Você precisa estar logado para aceder a esta página./i)).toBeInTheDocument();
  });

});
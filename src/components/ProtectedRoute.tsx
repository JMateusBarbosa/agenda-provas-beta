
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Interface para as props do componente ProtectedRoute
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Componente de Rota Protegida
 * 
 * Verifica se o usuário está autenticado antes de renderizar o conteúdo.
 * Se não estiver autenticado, redireciona para a página de login.
 * Também mostra um indicador de carregamento enquanto verifica a autenticação.
 * 
 * @param children Componente(s) filho(s) a serem renderizados se autenticado
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Mostrar indicador de carregamento enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      </div>
    );
  }

  // Redirecionar para login se não autenticado
  if (!user) {
    // Adicionar estado para armazenar a rota de origem para possível redirecionamento após login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Renderizar as rotas protegidas
  return <>{children}</>;
};

export default ProtectedRoute;

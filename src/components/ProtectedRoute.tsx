
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
  const { user, loading, authChecked } = useAuth();
  const location = useLocation();

  // Log the authentication state to help with debugging
  useEffect(() => {
    console.log('ProtectedRoute auth state:', { 
      user: user?.username || 'null', 
      loading, 
      authChecked,
      pathname: location.pathname 
    });
  }, [user, loading, authChecked, location.pathname]);

  // Se estiver ainda carregando e a autenticação não foi verificada, mostra o indicador
  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        <p className="ml-3 text-navy">Verificando autenticação...</p>
      </div>
    );
  }

  // Se a autenticação foi verificada e não há usuário, redireciona para login
  if (authChecked && !loading && !user) {
    console.log('Redirecionando para login - usuário não autenticado');
    // Salvar a rota atual para redirecionamento após login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Se há usuário autenticado, renderizar as rotas protegidas
  if (user) {
    console.log('Usuário autenticado, renderizando conteúdo protegido');
    return <>{children}</>;
  }

  // Fallback de segurança
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
      <p className="ml-3 text-navy">Carregando...</p>
    </div>
  );
};

export default ProtectedRoute;


import React, { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();

  // Log the authentication state to help with debugging
  useEffect(() => {
    console.log('ProtectedRoute auth state:', { user, loading, authChecked });
  }, [user, loading, authChecked]);

  // Limitar o tempo de carregamento para evitar loops infinitos
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (loading && !authChecked) {
        console.warn('Tempo de carregamento excedido, redirecionando para login');
        navigate('/login', { replace: true });
      }
    }, 8000); // 8 segundos como timeout máximo

    return () => clearTimeout(timeoutId);
  }, [loading, authChecked, navigate]);

  // Se estiver ainda carregando e a autenticação não foi verificada, mostra o indicador
  if (loading && !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        <p className="ml-3 text-navy">Verificando autenticação...</p>
      </div>
    );
  }

  // Se a autenticação foi verificada e não há usuário, redireciona para login
  if (authChecked && !user) {
    // Salvar a rota atual para redirecionamento após login
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Renderizar as rotas protegidas se autenticado
  return <>{children}</>;
};

export default ProtectedRoute;

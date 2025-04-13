
import React, { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';
import { useAuthState } from '@/hooks/useAuthState';
import { useAuthActions } from '@/hooks/useAuthActions';

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Provider de Autenticação
 * 
 * Componente que gerencia o estado de autenticação do usuário no sistema
 * Utiliza hooks personalizados para separar responsabilidades
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Utiliza o hook para gerenciar o estado da autenticação
  const { user, setUser, loading, setLoading, authChecked } = useAuthState();
  
  // Utiliza o hook para gerenciar as ações de autenticação
  const { login, logout } = useAuthActions({ setUser, setLoading });
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      schoolId: user?.schoolId || null,
      authChecked
    }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook para acessar o contexto de autenticação
 * Deve ser usado dentro de um AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

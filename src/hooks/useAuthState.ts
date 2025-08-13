
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/lib/types';

/**
 * Hook para gerenciar o estado de autenticação
 * 
 * Responsável por:
 * - Verificar o estado inicial da autenticação
 * - Gerenciar o estado do usuário e carregamento
 * - Configurar o listener para mudanças na autenticação
 */
export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    
    const checkAuth = async () => {
      try {
        console.log('Iniciando verificação de autenticação...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (!isMounted) return;
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
          return;
        }
        
        if (session?.user) {
          console.log('Sessão encontrada, buscando dados do usuário...');
          
          // Buscar os dados completos do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
            
          if (!isMounted) return;
          
          if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            if (isMounted) {
              setUser(null);
              setLoading(false);
              setAuthChecked(true);
            }
          } else if (userData) {
            console.log('Usuário encontrado:', userData.username);
            if (isMounted) {
              setUser({
                id: userData.id,
                email: userData.email,
                name: userData.name,
                schoolId: userData.school_id,
                username: userData.username
              });
              setLoading(false);
              setAuthChecked(true);
            }
          }
        } else {
          console.log('Nenhuma sessão ativa encontrada');
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };


    checkAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('Mudança no estado de autenticação:', event);
      
      // Resetar estados durante mudanças
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        if (event === 'SIGNED_OUT') {
          console.log('Usuário deslogado');
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
          return;
        }
      }
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Usuário logado, buscando dados...');
        
        // Buscar os dados completos do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
          
        if (!isMounted) return;
        
        if (userError) {
          console.error('Erro ao buscar dados do usuário no login:', userError);
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
        } else if (userData) {
          console.log('Login bem-sucedido para:', userData.username);
          if (isMounted) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              schoolId: userData.school_id,
              username: userData.username
            });
            setLoading(false);
            setAuthChecked(true);
          }
        }
      }
    });

    return () => {
      isMounted = false;
      
      authListener.subscription.unsubscribe();
    };
  }, []); // Dependências vazias para executar apenas uma vez

  return { user, setUser, loading, setLoading, authChecked };
};

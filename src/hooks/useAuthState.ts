
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
    // Flag para controlar se o componente ainda está montado
    let isMounted = true;
    let timeoutId: number | undefined;
    
    // Verificar o estado da autenticação no carregamento
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Se o componente foi desmontado, não continue
        if (!isMounted) return;
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          if (isMounted) {
            setLoading(false);
            setAuthChecked(true);
          }
          return;
        }
        
        if (session) {
          // Buscar os dados completos do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
            
          // Se o componente foi desmontado, não continue
          if (!isMounted) return;
          
          if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            // Se houver erro ao buscar o usuário, fazemos logout
            await supabase.auth.signOut();
            if (isMounted) {
              setUser(null);
              setLoading(false);
              setAuthChecked(true);
            }
          } else if (userData) {
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
          // Não há sessão ativa
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        if (isMounted) {
          setLoading(false);
          setAuthChecked(true);
        }
      }
    };

    // Definir um timeout para garantir que o estado de carregamento não fique preso
    timeoutId = window.setTimeout(() => {
      if (isMounted && loading) {
        console.warn('Timeout de verificação de autenticação atingido');
        setLoading(false);
        setAuthChecked(true);
      }
    }, 5000);

    checkAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;
      
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_IN' && session) {
        // Buscar os dados completos do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
          
        if (!isMounted) return;
        
        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
          await supabase.auth.signOut();
          if (isMounted) {
            setUser(null);
            setLoading(false);
            setAuthChecked(true);
          }
        } else if (userData) {
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
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setLoading(false);
          setAuthChecked(true);
        }
      }
    });

    // Limpar o listener e timeout ao desmontar o componente e marcar como desmontado
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, loading, setLoading, authChecked };
};

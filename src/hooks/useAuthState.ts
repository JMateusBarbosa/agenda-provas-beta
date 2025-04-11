
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

  useEffect(() => {
    // Verificar o estado da autenticação no carregamento
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Erro ao verificar sessão:', error);
          return;
        }
        
        if (session) {
          // Buscar os dados completos do usuário
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', session.user.id)
            .single();
            
          if (userError) {
            console.error('Erro ao buscar dados do usuário:', userError);
            await supabase.auth.signOut();
          } else if (userData) {
            setUser({
              id: userData.id,
              email: userData.email,
              name: userData.name,
              schoolId: userData.school_id,
              username: userData.username
            });
          }
        }
      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    
    // Configurar listener para mudanças de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Buscar os dados completos do usuário
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', session.user.id)
          .single();
          
        if (userError) {
          console.error('Erro ao buscar dados do usuário:', userError);
          await supabase.auth.signOut();
          setUser(null);
        } else if (userData) {
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            schoolId: userData.school_id,
            username: userData.username
          });
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    // Limpar o listener ao desmontar o componente
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return { user, setUser, loading, setLoading };
};

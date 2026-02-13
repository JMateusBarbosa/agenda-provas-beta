
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { User } from '@/lib/types';

/**
 * Hook de autenticação resiliente usando eventos do Supabase
 * - Usa onAuthStateChange para capturar INITIAL_SESSION, SIGNED_IN e SIGNED_OUT
 * - Define authChecked assim que recebemos o estado inicial
 * - Busca o perfil do usuário separadamente mantendo loading enquanto carrega
 */
export const useAuthState2 = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProfile = async (authId: string) => {
      try {
        console.log('Buscando perfil do usuário para auth_id:', authId);
        const { data: userData, error } = await supabase
          .from('users')
          .select('*')
          .eq('auth_id', authId)
          .single();

        if (!isMounted) return;

        if (error) {
          console.error('Erro ao buscar dados do usuário:', error);
          setUser(null);
        } else if (userData) {
          console.log('Perfil carregado para:', userData.username);
          setUser({
            id: userData.id,
            email: userData.email,
            name: userData.name,
            schoolId: userData.school_id,
            username: userData.username,
          });
        }
      } catch (err) {
        console.error('Exceção ao carregar perfil do usuário:', err);
        if (isMounted) setUser(null);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    // Assinar eventos de autenticação (inclui INITIAL_SESSION)
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;

      console.log('Evento de autenticação:', event);

      if (event === 'INITIAL_SESSION') {
        // Marcamos como verificado imediatamente para evitar travas
        setAuthChecked(true);
        if (session?.user) {
          // Carregar perfil mantendo loading true até finalizar
          setLoading(true);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
          setLoading(false);
        }
        return;
      }

      if (event === 'SIGNED_IN' && session?.user) {
        // Já consideramos a autenticação verificada
        setAuthChecked(true);
        setLoading(true);
        fetchUserProfile(session.user.id);
        return;
      }

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setLoading(false);
        setAuthChecked(true);
        return;
      }

      if (event === 'TOKEN_REFRESHED') {
        // Nada específico, mas garantimos que o estado está consistente
        if (session?.user) {
          setAuthChecked(true);
        }
      }
    });

    // Fallback de segurança: se por algum motivo o INITIAL_SESSION não chegar
    // marcamos como verificado após 3s para evitar travas de UI
    const safety = window.setTimeout(() => {
      if (isMounted && !authChecked) {
        console.warn('Timeout de verificação atingido (fallback)');
        setAuthChecked(true);
        setLoading(false);
      }
    }, 3000);

    return () => {
      isMounted = false;
      clearTimeout(safety);
      authListener.subscription.unsubscribe();
    };
  }, [authChecked]);

  return { user, setUser, loading, setLoading, authChecked };
};

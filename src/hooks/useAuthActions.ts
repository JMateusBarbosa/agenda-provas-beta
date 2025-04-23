
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase-client';
import { toast } from '@/components/ui/use-toast';
import { Dispatch, SetStateAction } from 'react';
import { User } from '@/lib/types';

/**
 * Interface para os parâmetros do hook useAuthActions
 */
interface UseAuthActionsParams {
  setUser: Dispatch<SetStateAction<User | null>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

/**
 * Hook para gerenciar as ações de autenticação
 * 
 * Fornece funções para:
 * - Login
 * - Logout
 */
export const useAuthActions = ({ setUser, setLoading }: UseAuthActionsParams) => {
  const navigate = useNavigate();

  /**
   * Função de login
   * 
   * Processo:
   * 1. Busca o usuário pelo nome de usuário para obter o email
   * 2. Faz login com o email e senha usando Supabase Auth
   * 
   * @param username Nome de usuário
   * @param password Senha
   */
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      
      // Primeiro, procurar o usuário pelo nome de usuário para obter o email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single();
      
      if (userError || !userData) {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha inválidos",
          variant: "destructive",
        });
        return;
      }
      
      // Agora fazer login com o email encontrado
      const { error } = await supabase.auth.signInWithPassword({ 
        email: userData.email, 
        password 
      });
      
      if (error) {
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha inválidos",
          variant: "destructive",
        });
        return;
      }
      
      // Navegar para o dashboard após login bem-sucedido em vez da página inicial
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função de logout otimizada
   * 
   * Encerra a sessão do usuário e redireciona para a página de login
   * Implementa uma abordagem otimizada para reduzir o tempo de resposta
   */
  const logout = async () => {
    try {
      // Primeiro, definimos o estado do usuário como null imediatamente para resposta rápida da UI
      setUser(null);
      
      // Em seguida, redireciona para a página de login antes de completar o processo de signOut
      navigate('/login');
      
      // Por fim, fazemos o signOut no Supabase em segundo plano
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Erro ao sair:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao tentar sair. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return { login, logout };
};

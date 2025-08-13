
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
      console.log('Iniciando processo de login para:', username);
      
      // Primeiro, procurar o usuário pelo nome de usuário para obter o email
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('email')
        .eq('username', username)
        .single();
      
      if (userError || !userData) {
        console.error('Usuário não encontrado:', userError);
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha inválidos",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log('Email encontrado para o usuário:', userData.email);
      
      // Agora fazer login com o email encontrado
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ 
        email: userData.email, 
        password 
      });
      
      if (authError) {
        console.error('Erro na autenticação:', authError);
        toast({
          title: "Erro de autenticação",
          description: "Nome de usuário ou senha inválidos",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log('Login realizado com sucesso');
      
      // O listener do onAuthStateChange vai capturar o evento SIGNED_IN
      // e atualizar o estado do usuário automaticamente
      
      // Navegar para o dashboard após login bem-sucedido
      navigate('/dashboard');
      setLoading(false);
      
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro de autenticação",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
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
      console.log('Iniciando logout...');
      
      // Primeiro, fazemos o signOut no Supabase
      await supabase.auth.signOut();
      
      // O listener do onAuthStateChange vai capturar o evento SIGNED_OUT
      // e limpar o estado do usuário automaticamente
      
      // Redireciona para a página de login
      navigate('/login');
      
      console.log('Logout realizado com sucesso');
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

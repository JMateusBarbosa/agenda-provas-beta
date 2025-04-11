
import { supabase } from './supabase-client';
import { User } from './types';

/**
 * API para autenticação e gerenciamento de usuários
 * 
 * Fornece funções para registro de usuários e verificação de nomes de usuário
 */
export const authApi = {
  /**
   * Registra um novo usuário no sistema
   * 
   * Processo:
   * 1. Cria o usuário no sistema de autenticação do Supabase
   * 2. Cria um registro na tabela 'users' com os dados adicionais
   * 
   * @param email Email do usuário (único)
   * @param password Senha para autenticação
   * @param name Nome completo do usuário
   * @param username Nome de usuário para login (único)
   * @param schoolId ID da escola associada ao usuário
   * @returns Dados do usuário criado
   */
  registerUser: async (
    email: string, 
    password: string, 
    name: string, 
    username: string, 
    schoolId: string
  ): Promise<User> => {
    // 1. Registrar o usuário no sistema de autenticação do Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    
    if (authError || !authData.user) {
      throw new Error(authError?.message || 'Erro ao criar usuário');
    }
    
    // 2. Criar o registro na tabela users
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        auth_id: authData.user.id,
        email: email,
        name: name,
        username: username,
        school_id: schoolId
      })
      .select()
      .single();
    
    if (userError || !userData) {
      // Se houver erro ao criar o usuário na tabela users, tentar excluir o usuário do auth
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(userError?.message || 'Erro ao criar perfil de usuário');
    }
    
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      schoolId: userData.school_id,
      username: userData.username
    };
  },
  
  /**
   * Verifica se um nome de usuário já existe
   * @param username Nome de usuário a verificar
   * @returns true se o nome de usuário já existe, false caso contrário
   */
  checkUsernameExists: async (username: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('username', username)
      .maybeSingle();
    
    if (error) {
      throw new Error('Erro ao verificar nome de usuário');
    }
    
    return data !== null;
  }
};


import { User } from '@/lib/types';

/**
 * Interface que define o formato do contexto de autenticação
 * Contém o usuário atual, estado de carregamento, funções de login/logout
 * e o ID da escola do usuário logado
 */
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  schoolId: string | null;
  authChecked: boolean;
}

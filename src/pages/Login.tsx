
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

/**
 * Schema de validação para login com username
 * - Username: mínimo de 3 caracteres
 * - Senha: mínimo de 6 caracteres
 */
const loginSchema = z.object({
  username: z.string().min(3, 'O nome de usuário deve ter pelo menos 3 caracteres'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres')
});

// Tipo baseado no schema de validação
type LoginFormValues = z.infer<typeof loginSchema>;

/**
 * Componente de Login
 * 
 * Responsável pela autenticação do usuário usando nome de usuário e senha.
 * Utiliza react-hook-form para gerenciamento do formulário e zod para validação.
 */
const Login = () => {
  // Hook de autenticação que fornece a função de login e estado de carregamento
  const { login, loading } = useAuth();
  
  // Configuração do formulário com validação
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  /**
   * Função que processa o envio do formulário
   * Chama a função de login do AuthContext com o username e senha
   */
  const onSubmit = async (data: LoginFormValues) => {
    await login(data.username, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg animate-fade-up">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-navy mb-4">
            <CalendarDays size={32} className="text-gold" />
          </div>
          <CardTitle className="text-2xl font-bold text-center text-navy">Sistema de Agendamento de Provas</CardTitle>
          <CardDescription className="text-center">
            Entre com seu nome de usuário e senha para acessar o sistema.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Campo de nome de usuário */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome de Usuário</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite seu nome de usuário" 
                        type="text"
                        disabled={loading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Campo de senha */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Digite sua senha" 
                        type="password"
                        disabled={loading}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full bg-navy hover:bg-navy/90" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Login;

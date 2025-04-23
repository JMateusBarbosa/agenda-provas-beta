
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';

const logoUrl = "/lovable-uploads/logo.png";

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
  const { login, loading, user, authChecked } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Redirecionar para o dashboard se já estiver autenticado
  useEffect(() => {
    // Só redireciona quando a verificação de autenticação já foi concluída e o usuário existe
    if (authChecked && user) {
      // Alterado para redirecionar para o dashboard em vez de usar o location.state
      navigate('/dashboard', { replace: true });
    }
  }, [user, authChecked, navigate]);
  
  // Configuração do formulário com validação
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  // Function to navigate back to the home page
  const handleGoBack = () => {
    navigate('/');
  };

  /**
   * Função que processa o envio do formulário
   * Chama a função de login do AuthContext com o username e senha
   */
  const onSubmit = async (data: LoginFormValues) => {
    try {
      // O redirect para o dashboard agora é feito dentro da função login
      await login(data.username, data.password);
    } catch (error) {
      console.error('Erro ao realizar login:', error);
    }
  };

  // Mostrar um loading se ainda estiver verificando a autenticação
  if (!authChecked && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-navy"></div>
        <p className="ml-3 text-gray-600">Verificando sessão...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg animate-fade-up relative">
        {/* Back button positioned responsivamente */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-4 left-4 z-10"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-5 w-5 md:h-6 md:w-6 text-navy" />
        </Button>

        <CardHeader className="space-y-1 flex flex-col items-center pt-12 md:pt-8">
          <img
            src={logoUrl}
            alt="Logo Indústria do Saber"
            className="w-20 h-20 md:w-24 md:h-24 rounded object-contain mb-4"
            style={{ background: 'white', padding: '0.5rem' }}
          />
          <CardTitle className="text-xl md:text-2xl font-bold text-center text-navy">
            Sistema de Agendamento de Provas
          </CardTitle>
          <CardDescription className="text-center text-sm md:text-base">
            Entre com seu nome de usuário e senha para acessar o sistema.
          </CardDescription>
        </CardHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 px-4 md:px-6">
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
                        className="h-10 md:h-11"
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
                        className="h-10 md:h-11"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4 px-4 md:px-6 pb-6">
              <Button 
                type="submit" 
                className="w-full bg-navy hover:bg-navy/90 h-10 md:h-11" 
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

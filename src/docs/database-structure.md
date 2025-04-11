
# Documentação da Estrutura do Banco de Dados

Este documento descreve em detalhes a estrutura do banco de dados utilizada pelo Sistema de Agendamento de Provas, incluindo todas as tabelas, relacionamentos, e como funciona o sistema de autenticação com Supabase.

## Visão Geral

O sistema utiliza o Supabase como backend, aproveitando tanto seu sistema de autenticação quanto seu banco de dados PostgreSQL. A estrutura consiste em 3 tabelas principais:

1. `schools` - Armazena as escolas cadastradas no sistema
2. `users` - Armazena os usuários do sistema, vinculados às escolas
3. `exam_schedules` - Armazena os agendamentos de provas

Além disso, o sistema utiliza a tabela interna de autenticação do Supabase `auth.users` para gerenciar credenciais de login.

## Tabelas Detalhadas

### 1. Tabela `schools`

Esta tabela armazena as informações de cada escola no sistema.

#### Estrutura SQL

```sql
CREATE TABLE IF NOT EXISTS schools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger para atualizar o campo updated_at nas escolas
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_school_updated_at
BEFORE UPDATE ON schools
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
```

#### Campos

| Campo       | Tipo                      | Descrição                                      |
|-------------|---------------------------|------------------------------------------------|
| id          | UUID                      | Identificador único da escola (chave primária) |
| name        | TEXT                      | Nome da escola                                 |
| created_at  | TIMESTAMP WITH TIME ZONE  | Data e hora de criação do registro             |
| updated_at  | TIMESTAMP WITH TIME ZONE  | Data e hora da última atualização do registro  |

### 2. Tabela `users`

Esta tabela armazena os usuários do sistema, com referência ao sistema de autenticação do Supabase.

#### Estrutura SQL

```sql
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  school_id UUID REFERENCES schools(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger para atualizar o campo updated_at nos usuários
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
```

#### Campos

| Campo       | Tipo                      | Descrição                                           |
|-------------|---------------------------|-----------------------------------------------------|
| id          | UUID                      | Identificador único do usuário (chave primária)     |
| auth_id     | UUID                      | Referência ao ID do usuário no sistema de auth      |
| email       | TEXT                      | Email do usuário (único)                            |
| name        | TEXT                      | Nome completo do usuário                            |
| username    | TEXT                      | Nome de usuário para login (único)                  |
| school_id   | UUID                      | ID da escola à qual o usuário pertence (chave estrangeira) |
| created_at  | TIMESTAMP WITH TIME ZONE  | Data e hora de criação do registro                  |
| updated_at  | TIMESTAMP WITH TIME ZONE  | Data e hora da última atualização do registro       |

### 3. Tabela `exam_schedules`

Esta tabela armazena os agendamentos de provas.

#### Estrutura SQL

```sql
CREATE TABLE IF NOT EXISTS exam_schedules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_name TEXT NOT NULL,
  module TEXT NOT NULL,
  pc_number INTEGER NOT NULL,
  exam_date TIMESTAMP WITH TIME ZONE NOT NULL,
  exam_time TEXT NOT NULL,
  exam_type TEXT NOT NULL CHECK (exam_type IN ('P1', 'Rec.1', 'Rec.2')),
  status TEXT NOT NULL CHECK (status IN ('Pendente', 'Aprovado', 'Reprovado')),
  school_id UUID REFERENCES schools(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índice para consultas rápidas por data
CREATE INDEX IF NOT EXISTS idx_exam_date ON exam_schedules(exam_date);

-- Índice para consultas rápidas por escola
CREATE INDEX IF NOT EXISTS idx_school_id ON exam_schedules(school_id);

-- Trigger para atualizar o campo updated_at nos agendamentos
CREATE TRIGGER update_exam_schedules_updated_at
BEFORE UPDATE ON exam_schedules
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();
```

#### Campos

| Campo         | Tipo                      | Descrição                                             |
|---------------|---------------------------|-------------------------------------------------------|
| id            | UUID                      | Identificador único do agendamento (chave primária)   |
| student_name  | TEXT                      | Nome do estudante que fará a prova                    |
| module        | TEXT                      | Módulo/disciplina da prova                            |
| pc_number     | INTEGER                   | Número do computador a ser utilizado                  |
| exam_date     | TIMESTAMP WITH TIME ZONE  | Data da prova                                         |
| exam_time     | TEXT                      | Horário da prova                                      |
| exam_type     | TEXT                      | Tipo da prova (P1, Rec.1, Rec.2)                     |
| status        | TEXT                      | Status da prova (Pendente, Aprovado, Reprovado)       |
| school_id     | UUID                      | ID da escola associada (chave estrangeira)            |
| created_at    | TIMESTAMP WITH TIME ZONE  | Data e hora de criação do registro                    |
| updated_at    | TIMESTAMP WITH TIME ZONE  | Data e hora da última atualização do registro         |

## Relacionamentos Entre Tabelas

1. **Users → Schools**: Cada usuário pertence a uma escola específica
   - `users.school_id` referencia `schools.id`
   
2. **Exam_Schedules → Schools**: Cada agendamento de prova está associado a uma escola
   - `exam_schedules.school_id` referencia `schools.id`

3. **Users → Auth.Users**: Cada registro na tabela `users` está associado a um registro no sistema de autenticação do Supabase
   - `users.auth_id` referencia o ID na tabela interna de autenticação do Supabase

## Sistema de Autenticação

### Como Funciona o Login com Username

O sistema de login por username funciona da seguinte maneira:

1. O usuário insere seu username e senha no formulário de login
2. O sistema busca na tabela `users` o registro correspondente ao username fornecido
3. Se encontrado, recupera o email associado a esse username
4. Utiliza o email e a senha para autenticar contra o sistema de autenticação do Supabase
5. Se autenticado com sucesso, o usuário recebe um token de sessão e é redirecionado para a página inicial

### Código de Autenticação

#### Função de Login (AuthContext.tsx)

```typescript
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
    
    navigate('/');
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
```

#### Função de Registro de Usuário (auth-api.ts)

```typescript
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
}
```

## Como Registrar Novos Usuários

Para registrar um novo usuário no sistema, é necessário:

1. Criar um registro na tabela de autenticação do Supabase com email e senha
2. Criar um registro na tabela `users` com os dados do usuário e a referência ao ID de autenticação

O processo completo é feito pela função `registerUser` no arquivo `auth-api.ts`. Este processo garante que:

1. Cada usuário tenha credenciais seguras armazenadas no sistema de autenticação do Supabase
2. Cada usuário esteja associado a uma escola específica
3. Cada usuário tenha um nome de usuário único para login

## Observações Importantes

1. **Segurança**: As senhas nunca são armazenadas diretamente na tabela `users`. Elas são gerenciadas pelo sistema de autenticação do Supabase, que implementa práticas seguras de criptografia.

2. **Uniqueness**: Os campos `email` e `username` possuem restrições de unicidade para evitar duplicações.

3. **Integridade Referencial**: As chaves estrangeiras garantem que usuários e agendamentos só possam ser associados a escolas existentes.

4. **Timestamps Automáticos**: Todas as tabelas possuem campos `created_at` e `updated_at` que são preenchidos automaticamente.

5. **Índices**: Foram criados índices nas colunas mais utilizadas em buscas para melhorar a performance.

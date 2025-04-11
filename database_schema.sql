
-- Tabela de escolas
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

-- Tabela de usuários (atualizada para incluir username)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL, -- Campo username adicionado como único
  school_id UUID REFERENCES schools(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Trigger para atualizar o campo updated_at nos usuários
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE update_modified_column();

-- Tabela de agendamentos de provas
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

-- Script para migrar dados existentes (atribuir a uma escola específica)
-- Supondo que você já criou uma escola e tem seu ID
-- UPDATE exam_schedules SET school_id = 'ID_DA_SUA_ESCOLA' WHERE school_id IS NULL;

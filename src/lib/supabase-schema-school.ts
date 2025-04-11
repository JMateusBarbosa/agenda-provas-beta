
/**
 * Supabase Database Schema para Escolas
 * 
 * SQL para criar a tabela school:
 * 
 * CREATE TABLE schools (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   name TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
 * );
 * 
 * -- Trigger para atualizar o campo updated_at
 * CREATE TRIGGER update_school_updated_at
 * BEFORE UPDATE ON schools
 * FOR EACH ROW
 * EXECUTE PROCEDURE update_modified_column();
 */

export type School = {
  id: string;
  name: string;
}

export const toSupabaseSchool = (school: Omit<School, 'id'>): Record<string, any> => {
  return {
    name: school.name
  };
};

export const fromSupabaseSchool = (record: Record<string, any>): School => {
  return {
    id: record.id,
    name: record.name
  };
};

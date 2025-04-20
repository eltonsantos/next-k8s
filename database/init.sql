-- Script de inicialização do banco de dados para o Task Manager

-- Conectar ao banco de dados PostgreSQL
\connect taskmanager;

-- Criar extensão UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tipo ENUM para prioridades de tarefas
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'task_priority') THEN
        CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high');
    END IF;
END
$$;

-- Criar tabela de tarefas (se não existir)
CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    priority task_priority DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar um índice na coluna de título para pesquisas mais rápidas
CREATE INDEX IF NOT EXISTS idx_tasks_title ON tasks(title);

-- Criar um índice na coluna de conclusão para filtragem mais rápida
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

-- Inserir algumas tarefas de exemplo
INSERT INTO tasks (title, description, completed, priority, due_date)
VALUES
    ('Aprender Docker', 'Estudar conceitos básicos de Docker e como criar containers', FALSE, 'high', CURRENT_TIMESTAMP + INTERVAL '7 days'),
    ('Configurar Kubernetes', 'Configurar um cluster Kubernetes local para testes', FALSE, 'medium', CURRENT_TIMESTAMP + INTERVAL '14 days'),
    ('Estudar Node.js', 'Revisar conceitos avançados de Node.js e Express', TRUE, 'medium', CURRENT_TIMESTAMP - INTERVAL '2 days'),
    ('Praticar com Next.js', 'Criar um projeto simples usando Next.js e Tailwind', FALSE, 'low', CURRENT_TIMESTAMP + INTERVAL '5 days'),
    ('Preparar para entrevista', 'Revisar conceitos de programação e fazer exercícios práticos', FALSE, 'high', CURRENT_TIMESTAMP + INTERVAL '3 days');

-- Criar função para atualizar automaticamente o timestamp de updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o timestamp de updatedAt quando uma tarefa for atualizada
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Conceder privilégios
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
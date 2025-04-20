import axios from 'axios';
import { Task } from '@/app/components/TaskItem';

// Determinar o endereço do backend baseado no ambiente
// Em um ambiente de desenvolvimento, o Next.js roda no browser e localhost funciona
// Em um ambiente Docker, precisamos usar o nome do serviço 'backend'
const isRunningInNode = typeof window === 'undefined';
const isRunningInDocker = process.env.NEXT_PUBLIC_RUNNING_IN_DOCKER === 'true';
const baseURL = isRunningInNode || isRunningInDocker 
  ? 'http://backend:3001/api'  // URL do backend no Docker 
  : 'http://localhost:3001/api'; // URL do backend para desenvolvimento local

console.log("API base URL:", baseURL);

// Criar uma instância do axios
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interface para criação de tarefa
export interface CreateTaskInput {
  title: string;
  completed?: boolean;
}

// Interface para atualização de tarefa
export interface UpdateTaskInput {
  title?: string;
  completed?: boolean;
}

// Buscar todas as tarefas
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    console.log('Fetching tasks from:', api.defaults.baseURL + '/tasks');
    const response = await api.get('/tasks');
    console.log('Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

// Criar uma nova tarefa
export const createTask = async (task: CreateTaskInput): Promise<Task> => {
  try {
    const response = await api.post('/tasks', task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

// Atualizar uma tarefa existente
export const updateTask = async (id: string, task: UpdateTaskInput): Promise<Task> => {
  try {
    const response = await api.put(`/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Excluir uma tarefa
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};

export default api;
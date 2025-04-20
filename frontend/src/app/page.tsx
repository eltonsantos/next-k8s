'use client';

import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskFilters, { FilterType } from './components/TaskFilters';
import { Task } from './components/TaskItem';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../services/api';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tasksData = await fetchTasks();
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Não foi possível carregar as tarefas. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (title: string) => {
    try {
      setIsAddingTask(true);
      setError(null);
      const newTask = await createTask({ title, completed: false });
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
      setError('Não foi possível adicionar a tarefa. Tente novamente mais tarde.');
    } finally {
      setIsAddingTask(false);
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      setUpdatingTaskId(taskId);
      setError(null);
      const taskToUpdate = tasks.find(task => task.id === taskId);
      
      if (!taskToUpdate) return;
      
      const updatedTask = await updateTask(taskId, {
        ...taskToUpdate,
        completed: !taskToUpdate.completed
      });
      
      setTasks(tasks.map(task => 
        task.id === taskId ? updatedTask : task
      ));
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Não foi possível atualizar a tarefa. Tente novamente mais tarde.');
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      setDeletingTaskId(taskId);
      setError(null);
      await deleteTask(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Não foi possível excluir a tarefa. Tente novamente mais tarde.');
    } finally {
      setDeletingTaskId(null);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Gerenciador de Tarefas
        </h1>
        
        <TaskForm 
          onAddTask={handleAddTask} 
          isLoading={isAddingTask} 
        />
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <TaskFilters 
            currentFilter={filter} 
            onFilterChange={setFilter} 
          />
          
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
              {error}
            </div>
          )}
          
          <TaskList
            tasks={filteredTasks}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDeleteTask}
            isLoading={isLoading}
            updatingTaskId={updatingTaskId}
            deletingTaskId={deletingTaskId}
          />
        </div>
      </div>
    </div>
  );
}
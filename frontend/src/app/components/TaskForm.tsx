'use client';

import { useState } from 'react';

interface TaskFormProps {
  onAddTask: (title: string) => void;
  isLoading?: boolean;
}

export default function TaskForm({ onAddTask, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle('');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-2">
          <label htmlFor="task-input" className="font-medium text-gray-700">
            Nova Tarefa
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              id="task-input"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="O que precisa ser feito?"
              className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors duration-200"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? 'Adicionando...' : 'Adicionar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
'use client';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export default function TaskItem({
  task,
  onToggleComplete,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}: TaskItemProps) {
  return (
    <li className="py-3 border-b border-gray-200 last:border-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggleComplete(task.id)}
            className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
            disabled={isUpdating}
          />
          <span 
            className={`ml-3 ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}
          >
            {task.title}
          </span>
        </div>
        
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 focus:outline-none"
          disabled={isDeleting}
          aria-label="Excluir tarefa"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </li>
  );
}
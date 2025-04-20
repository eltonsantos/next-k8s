'use client';

import TaskItem, { Task } from './TaskItem';

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
  updatingTaskId?: string | null;
  deletingTaskId?: string | null;
}

export default function TaskList({
  tasks,
  onToggleComplete,
  onDelete,
  isLoading = false,
  updatingTaskId = null,
  deletingTaskId = null,
}: TaskListProps) {
  if (isLoading) {
    return (
      <div className="text-center py-6 text-gray-500">
        Carregando tarefas...
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-6 text-gray-500">
        Nenhuma tarefa encontrada.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleComplete={onToggleComplete}
          onDelete={onDelete}
          isUpdating={updatingTaskId === task.id}
          isDeleting={deletingTaskId === task.id}
        />
      ))}
    </ul>
  );
}
'use client';

export type FilterType = 'all' | 'active' | 'completed';

interface TaskFiltersProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export default function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="mb-4 flex justify-center space-x-2">
      <button
        className={`px-4 py-2 rounded ${currentFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onFilterChange('all')}
      >
        Todas
      </button>
      <button
        className={`px-4 py-2 rounded ${currentFilter === 'active' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onFilterChange('active')}
      >
        Ativas
      </button>
      <button
        className={`px-4 py-2 rounded ${currentFilter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
        onClick={() => onFilterChange('completed')}
      >
        Concluídas
      </button>
    </div>
  );
}
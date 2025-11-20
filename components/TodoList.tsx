'use client';

import { useState } from 'react';
import { Todo, UpdateTodoInput } from '@/types/todo';
import EditTodoModal from './EditTodoModal';

interface TodoListProps {
  todos: Todo[];
  onUpdate: (id: string, updateData: UpdateTodoInput) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  loading: boolean;
}

type FilterType = 'all' | 'active' | 'completed';

export default function TodoList({ todos, onUpdate, onDelete, loading }: TodoListProps) {
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const handleToggleComplete = async (todo: Todo): Promise<void> => {
    await onUpdate(todo.id, { completed: !todo.completed });
  };

  const handleDelete = async (id: string): Promise<void> => {
    if (confirm('Are you sure you want to delete this todo?')) {
      await onDelete(id);
    }
  };

  const handleEdit = (todo: Todo): void => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleSaveEdit = async (id: string, updateData: UpdateTodoInput): Promise<boolean> => {
    return await onUpdate(id, updateData);
  };

  const handleCloseModal = (): void => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-gray-600">Loading todos...</p>
      </div>
    );
  }

  return (
    <>
      <div className="card overflow-hidden">
        {/* Filters */}
        <div className="flex bg-gray-50 border-b border-gray-200">
          <button 
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
              filter === 'all' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('all')}
          >
            All ({todos.length})
          </button>
          <button 
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
              filter === 'active' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('active')}
          >
            Active ({todos.filter(t => !t.completed).length})
          </button>
          <button 
            className={`flex-1 py-4 px-4 text-sm font-medium transition-colors ${
              filter === 'completed' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            onClick={() => setFilter('completed')}
          >
            Completed ({todos.filter(t => t.completed).length})
          </button>
        </div>

        {/* Todo Items */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTodos.length === 0 ? (
            <div className="text-center py-12 text-gray-500 italic">
              {filter === 'all' ? 'No todos yet. Add one above!' : 
               filter === 'active' ? 'No active todos!' : 'No completed todos!'}
            </div>
          ) : (
            filteredTodos.map((todo, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-start p-4 border-b border-gray-100 last:border-b-0 transition-colors hover:bg-gray-50 group ${
                  todo.completed ? 'opacity-70' : ''
                }`}
              >
                <div className="flex items-start space-x-3 flex-1">
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggleComplete(todo)}
                    className="mt-1 w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                  />
                  
                  {/* Todo Content */}
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleEdit(todo)}
                  >
                    <h3 className={`font-medium text-gray-900 group-hover:text-blue-600 transition-colors ${
                      todo.completed ? 'line-through' : ''
                    }`}>
                      {todo.title}
                    </h3>
                    
                    {todo.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {todo.description}
                      </p>
                    )}
                    
                    <div className="flex flex-col sm:flex-row sm:space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        Created: {new Date(todo.createdAt).toLocaleDateString()}
                      </span>
                    
                        <span className="text-xs text-gray-500">
                          Updated: {new Date(todo.updatedAt).toLocaleDateString()}
                        </span>
                    
                    </div>
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(todo)}
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Edit todo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(todo.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete todo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Edit Modal */}
      <EditTodoModal
        todo={editingTodo}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveEdit}
      />
    </>
  );
}
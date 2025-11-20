'use client';

import { useTodos } from '@/hooks/useTodos';
import AddTodo from '@/components/AddTodo';
import TodoList from '@/components/TodoList';

export default function Home() {
  const { todos, loading, error, addTodo, updateTodo, deleteTodo, refetch } = useTodos();

  const handleAddTodo = async (todoData: Parameters<typeof addTodo>[0]): Promise<boolean> => {
    return await addTodo(todoData);
  };

  const handleUpdateTodo = async (id: string, updateData: Parameters<typeof updateTodo>[1]): Promise<boolean> => {
    return await updateTodo(id, updateData);
  };

  const handleDeleteTodo = async (id: string): Promise<boolean> => {
    return await deleteTodo(id);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚀 Next.js Todo App
          </h1>
          <p className="text-lg text-gray-600">
            Full-stack application with MongoDB + TypeScript + Tailwind
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="mb-8">
          <AddTodo onAdd={handleAddTodo} />
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700">Error: {error}</p>
              </div>
              <button 
                onClick={refetch}
                className="text-red-700 hover:text-red-800 font-medium text-sm"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Todo List */}
        <div className="mb-8">
          <TodoList
            todos={todos}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
            loading={loading}
          />
        </div>

        {/* Stats */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-6 bg-white rounded-lg px-6 py-3 shadow-sm border border-gray-200">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{todos.length}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {todos.filter(t => t.completed).length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {todos.filter(t => !t.completed).length}
              </div>
              <div className="text-sm text-gray-500">Pending</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
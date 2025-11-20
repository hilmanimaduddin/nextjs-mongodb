'use client';

import { useState, useEffect } from 'react';
import { Todo, CreateTodoInput, UpdateTodoInput, TodosApiResponse } from '@/types/todo';

interface UseTodosReturn {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  addTodo: (todoData: CreateTodoInput) => Promise<boolean>;
  updateTodo: (id: string, updateData: UpdateTodoInput) => Promise<boolean>;
  deleteTodo: (id: string) => Promise<boolean>;
}

export function useTodos(): UseTodosReturn {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/todos');
      const result: TodosApiResponse = await response.json();
      
      if (result.success && result.data) {
        setTodos(result.data);
      } else {
        setError(result.error || 'Failed to fetch todos');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async (todoData: CreateTodoInput): Promise<boolean> => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(todoData),
      });
      
      const result: TodosApiResponse = await response.json();
      
      if (result.success && result.data) {
        setTodos(prev => [...prev, result.data] as Todo[]);
        fetchTodos();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error adding todo:', error);
      return false;
    }
  };

  const updateTodo = async (id: string, updateData: UpdateTodoInput): Promise<boolean> => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTodos(prev => 
          prev.map(todo => 
            todo._id === id ? { ...todo, ...updateData } : todo
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating todo:', error);
      return false;
    }
  };

  const deleteTodo = async (id: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      
      const result = await response.json();
      
      if (result.success) {
        setTodos(prev => prev.filter(todo => todo._id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting todo:', error);
      return false;
    }
  };

  return {
    todos,
    loading,
    error,
    refetch: fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo,
  };
}
'use client';

import { useState, FormEvent } from 'react';
import { CreateTodoInput } from '@/types/todo';

interface AddTodoProps {
  onAdd: (todoData: CreateTodoInput) => Promise<boolean>;
}

export default function AddTodo({ onAdd }: AddTodoProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!title.trim()) return;

    setLoading(true);
    const success = await onAdd({
      title: title.trim(),
      description: description.trim(),
    });

    if (success) {
      setTitle('');
      setDescription('');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6">
      <div className="space-y-4">
        {/* Title Input */}
        <div>
          <input
            type="text"
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="input-field text-gray-900"
            disabled={loading}
            required
          />
        </div>
        
        {/* Description Input */}
        <div>
          <textarea
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            className="input-field text-gray-900 resize-none"
            disabled={loading}
            rows={2}
          />
        </div>
        
        {/* Submit Button */}
        <button 
          type="submit" 
          className="btn-primary w-full flex items-center justify-center space-x-2"
          disabled={loading || !title?.trim()}
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Add Todo</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
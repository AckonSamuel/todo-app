// types/Todo.ts
export type TodoStatus = 'not started' | 'in progress' | 'completed' | 'all';

export interface Todo {
  id: number;
  title: string;
  details: string;
  status: TodoStatus;
}

export interface TodoFormData {
  title: string;
  details: string;
  status: TodoStatus;
}

// Utility type to make certain fields optional
export type PartialTodo = Partial<Omit<Todo, 'id'>> & { id: number };

// Type for API response
export interface ApiResponse<T> {
  data: T;
  message?: string;
}
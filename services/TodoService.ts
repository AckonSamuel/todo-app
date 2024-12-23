import { Todo, TodoFormData, TodoStatus } from '../types/Todo';

const BASE_URL = 'https://pengion-todo-a4f1355a880e.herokuapp.com/api/v1/todos';

export class TodoService {
  static async fetchTodos(status?: TodoStatus, search?: string): Promise<Todo[]> {
    try {
      const url = new URL(BASE_URL);
      if (status && status != 'all') url.searchParams.append('status', status);
      if(search) url.searchParams.append('search', search);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Fetch todos failed');

      return data.data || [];
    } catch (error) {
      this.handleError(error, 'Fetch todos failed');
      throw error;
    }
  }

  static async findTodoById(id: number): Promise<Todo> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Fetch todo failed');

      return data.data;
    } catch (error) {
      this.handleError(error, 'Fetch todo failed');
      throw error;
    }
  }

  static async createTodo(todo: any): Promise<Todo> {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todo.title,
          details: todo.details,
          status: todo.status
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Create todo failed');

      return data.data;
    } catch (error) {
      this.handleError(error, 'Create todo failed');
      throw error;
    }
  }

  static async updateTodo(id: number, todo: Partial<TodoFormData>): Promise<Todo> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: todo.title,
          details: todo.details,
          status: todo.status
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Update todo failed');

      return data.data;
    } catch (error) {
      this.handleError(error, 'Update todo failed');
      throw error;
    }
  }

  static async deleteTodo(id: number): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Delete todo failed');
      }
    } catch (error) {
      this.handleError(error, 'Delete todo failed');
      throw error;
    }
  }

  // Error handling utility
  private static handleError(error: any, defaultMessage: string) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
      throw new Error(error.message || defaultMessage);
    } else {
      console.error('Unexpected error:', error);
      throw new Error(defaultMessage);
    }
  }
}

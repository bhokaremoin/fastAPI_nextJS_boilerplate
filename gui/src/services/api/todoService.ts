import api from './apiConfig';
import {TodoCreatePayload, TodoItem, TodoUpdatePayload} from '@/types/todo';

export const getTodos = () => {
    return api.get<TodoItem[]>('/todos');
};

export const createTodo = (payload: TodoCreatePayload) => {
    return api.post<TodoItem>('/todos', payload);
};

export const updateTodo = (id: string, payload: TodoUpdatePayload) => {
    return api.put<TodoItem>(`/todos/${id}`, payload);
};

export const deleteTodo = (id: string) => {
    return api.delete(`/todos/${id}`);
};
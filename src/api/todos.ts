import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export async function getTodos() {
  try {
    const res = await api.get<Todo[]>("/api/todos/");
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createTodo(text: string) {
  try {
    const res = await api.post<Todo>("/api/todos/", { text });
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteTodo(id: string) {
  try {
    const res = await api.delete("/api/todos/", { data: { _id: id } });
    return res.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateTodo(todo: Partial<Todo> & { _id: string }) {
  try {
    const res = await api.put("/api/todos/", todo);
    return res.status;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export function useTodos() {
  return useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
    enabled: true,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}

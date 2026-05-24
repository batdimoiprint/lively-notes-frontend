import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export interface Todo {
  _id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

export async function getTodos() {
  const res = await api.get<Todo[]>("/api/todos/");
  return res.data;
}

export async function createTodo(text: string) {
  const res = await api.post<Todo>("/api/todos/", { text });
  return res.data;
}

export async function deleteTodo(id: string) {
  const res = await api.delete("/api/todos/", { data: { _id: id } });
  return res.status;
}

export async function updateTodo(todo: Partial<Todo> & { _id: string }) {
  const res = await api.put("/api/todos/", todo);
  return res.status;
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

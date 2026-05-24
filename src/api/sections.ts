import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export interface Section {
  _id: string;
  title: string;
  order: number;
  noteCount?: number;
  createdAt: string;
}

export async function getSections() {
  const res = await api.get<Section[]>("/api/sections/");
  return res.data;
}

export async function createSection(title: string, id?: string, order?: number) {
  const res = await api.post<Section>("/api/sections/", { title, _id: id, order });
  return res.data;
}

export async function deleteSection(id: string) {
  const res = await api.delete("/api/sections/", { data: { _id: id } });
  return res.status;
}

export async function updateSection(section: Partial<Section> & { _id: string }) {
  const res = await api.put("/api/sections/", section);
  return res.status;
}

export async function reorderSections(orderedIds: string[]) {
  const res = await api.patch("/api/sections/reorder", { orderedIds });
  return res.data;
}

export async function initializeSections() {
  const res = await api.post("/api/sections/initialize");
  return res.data;
}

export function useSections() {
  return useQuery({
    queryKey: ["sections"],
    queryFn: getSections,
    enabled: true,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}

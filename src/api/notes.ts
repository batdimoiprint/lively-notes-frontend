import { type Tasks, type Inputs } from "@/types/tasktypes";
import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export async function getNotes() {
  const res = await api.get<Tasks[]>("/api/notes/");
  return res.data;
}

export async function deleteNotes(id: string) {
  const res = await api.delete("/api/notes/", { data: { _id: id } });
  return res.status;
}

export async function createNotes(inputs: Inputs) {
  const res = await api.post("/api/notes/", {
    title: inputs.title,
    body: inputs.body,
    sectionId: inputs.sectionId,
  });
  if (res.status == 201) {
    return res.data;
  } else {
    throw new Error("No token");
  }
}

export async function editNotes(inputs: Tasks) {
  const res = await api.patch("/api/notes/", {
    _id: inputs._id,
    title: inputs.title,
    body: inputs.body,
  });

  return res.status;
}

export async function reorderNotes(orderedIds: string[]) {
  const res = await api.patch("/api/notes/reorder", { orderedIds });
  return res.data;
}

export async function moveNoteToSection(noteId: string, sectionId: string) {
  const res = await api.patch("/api/notes/move-section", { noteId, sectionId });
  return res.data;
}

export function useNotes() {
  return useQuery({
    queryKey: ["notes"],
    queryFn: getNotes,
    enabled: true,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}

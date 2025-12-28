import { type Tasks, type Inputs } from "@/types/tasktypes";
import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export async function getNotes() {
    try {
        const res = await api.get<Tasks[]>("/api/notes/");
        return res.data;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteNotes(id: string) {
    try {
        const res = await api.delete("/api/notes/", { data: { _id: id } });

        return res.status;
    } catch (error) {
        console.log(error);
    }
}

export async function createNotes(inputs: Inputs) {
    try {
        const res = await api.post("/api/notes/", { title: inputs.title, body: inputs.body });

        return res.status;
    } catch (error) {
        console.log(error)
    }
}

export async function editNotes(inputs: Tasks) {
    try {
        const res = await api.put("/api/notes/", { _id: inputs._id, title: inputs.title, body: inputs.body });

        return res.status;
    } catch (error) {
        console.log(error)
    }
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

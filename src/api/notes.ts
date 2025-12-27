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

export async function createNotes(inputs: Inputs): Promise<Tasks[]> {
    const response = await fetch(
        `${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`,
        {
            headers: { "Content-Type": "application/json" },
            method: "POST",
            body: JSON.stringify(inputs),
        }
    );
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
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

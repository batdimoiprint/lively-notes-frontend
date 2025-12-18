import type Tasks from "@/types/tasktypes"
import type Inputs from "@/types/tasktypes"
import { useQuery } from "@tanstack/react-query"



export async function getNotes(): Promise<Tasks[]> {
    const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`)
    if (!response.ok) throw new Error("Failed to fetch notes");
    return response.json()
}



// export async function getNotes() {
//     try {
//         const res = await axios.get<Tasks>('/api/notes/')
//         console.log(res.data)
//         return res.data
//     } catch (error) {
//         console.log(error)
//     }
// }


export async function deleteNotes(id: number): Promise<Tasks[]> {
    const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`, {
        headers: { "Content-Type": "application/json" },
        method: "DELETE",
        body: JSON.stringify({ _id: (id) })
    })

    return response.json()
}

export async function createNotes(inputs: Inputs): Promise<Tasks[]> {
    const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`, {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(inputs)
    })
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()

}


export function useNotes() {
    return useQuery({
        queryKey: ['notes'],
        queryFn: getNotes,
        enabled: true,
        staleTime: 60000,
        retry: 2,
        refetchOnWindowFocus: true,
        networkMode: 'offlineFirst'
    })
}

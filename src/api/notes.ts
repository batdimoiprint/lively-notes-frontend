type Tasks = {
    _id: number;
    title: string;
    body: string;
};

export async function getNotes() {
    try {
        const response = await fetch(`${import.meta.env.VITE_ENV_BASE_URL}/api/notes/`)
        const data: Tasks[] = await response.json()
        return data

    } catch (error) {
        console.log(error)
    }
}
import type { MatrixConfig } from "@/types/matrixConfig"
import api from "./axiosInstance"

async function getSettings() {
    try {
        const res = await api.get<MatrixConfig[]>('/api/settings')
        const data = { ...res.data[0] }
        return data
    } catch (error) {
        console.error(error)
    }
}

export { getSettings }
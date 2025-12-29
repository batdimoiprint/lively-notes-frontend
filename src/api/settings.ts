import { DEFAULT_MATRIX_CONFIG, type MatrixConfig } from "@/types/matrixConfig"
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

async function resetSettings() {
    try {
        const req = await api.post<MatrixConfig>('/api/settings', { ...DEFAULT_MATRIX_CONFIG })
        const res = req.status

        return res
    } catch (error) {
        console.error(error)
    }
}


export { getSettings, resetSettings }
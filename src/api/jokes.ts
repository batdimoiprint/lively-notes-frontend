import api from "./axiosInstance"

const url = "https://api.api-ninjas.com/v1/jokes"
const options = {
    headers: { "X-Api-Key": import.meta.env.VITE_QUOTES_API },
    method: "GET",
}

export default async function getJoke() {
    const res = await api.get(url, options)
    const response = await res.data
    return response
}
import api from "./axiosInstance";

export async function Login(input:string) {
    try {
        const res = await api.post<string>("/api/auth/login", {code: input})
        if (res.status === 200) {
            return true    
        } else {            
            throw new Error("Wrong Password");            
        }
        
    } catch (error) {
        console.log(error)
        throw error
    }
}
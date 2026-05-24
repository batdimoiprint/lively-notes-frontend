import api from "./axiosInstance";

export async function Login(input: string) {
  const res = await api.post<string>("/api/auth/login", { code: input });
  if (res.status === 200) {
    return true;
  } else {
    throw new Error("Wrong Password");
  }
}

export async function WakeBackend() {
  const res = await api.get("/api/wake");
  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
}

export async function GetMe() {
  const res = await api.get("/api/auth/me");
  if (res.status === 200) {
    return res.data.userId;
  } else {
    console.log("error");
    throw new Error("No token");
  }
}

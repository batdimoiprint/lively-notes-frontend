import api from "./axiosInstance";

export interface IGUsernameItem {
  autoIncrement: number;
  igUsername: string;
}

interface IGUsernameResponse {
  data: IGUsernameItem[];
}

export async function getIgUsernames() {
  const res = await api.get<IGUsernameResponse>("/api/igpost/usernames");
  return res.data.data;
}

export async function createIgUsername(igUsername: string) {
  const res = await api.post("/api/igpost/usernames", {
    igUsername,
  });

  return res.data;
}

export async function updateIgUsername(autoIncrement: number, igUsername: string) {
  const res = await api.put(`/api/igpost/usernames/${autoIncrement}`, {
    igUsername,
  });

  return res.data;
}

export async function deleteIgUsername(autoIncrement: number) {
  const res = await api.delete(`/api/igpost/usernames/${autoIncrement}`);
  return res.data;
}

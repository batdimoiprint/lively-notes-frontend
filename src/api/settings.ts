import { DEFAULT_MATRIX_CONFIG, type MatrixConfig } from "@/types/matrixConfig";
import api from "./axiosInstance";
import { useQuery } from "@tanstack/react-query";

async function getSettings() {
  try {
    const res = await api.get<MatrixConfig[]>("/api/settings");
    return { ...res.data[0] };
  } catch (error) {
    console.error(error);
  }
}

async function resetSettings() {
  try {
    const req = await api.post<MatrixConfig>("/api/settings", { ...DEFAULT_MATRIX_CONFIG });
    return req.status;
  } catch (error) {
    console.error(error);
  }
}

async function patchSettings(settings: object) {
  try {
    const req = await api.patch("/api/settings", { ...settings });
    return req.status;
  } catch (error) {
    console.error(error);
  }
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: getSettings,
    enabled: true,
    staleTime: Infinity,
    retry: 2,
    refetchOnWindowFocus: true,
    networkMode: "offlineFirst",
  });
}

export { getSettings, resetSettings, patchSettings };

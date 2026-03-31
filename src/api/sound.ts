import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import api from "./axiosInstance";

export interface PomodoroSoundUploadResponse {
  message: string;
  sound: {
    fileName: string;
    mimeType: string;
    size: number;
    updatedAt: string;
  };
}

export async function getPomodoroSound() {
  try {
    const res = await api.get<Blob>("/api/sound", {
      responseType: "blob",
    });

    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }

    throw error;
  }
}

export async function uploadPomodoroSound(sound: File) {
  const formData = new FormData();
  formData.append("sound", sound);

  const res = await api.post<PomodoroSoundUploadResponse>("/api/sound", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function deletePomodoroSound() {
  const res = await api.delete("/api/sound");
  return res.data;
}

export function usePomodoroSound() {
  return useQuery({
    queryKey: ["pomodoroSound"],
    queryFn: getPomodoroSound,
  });
}

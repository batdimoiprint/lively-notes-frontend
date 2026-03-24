import api from "./axiosInstance";

export interface BackgroundImageResponse {
  public_id: string;
  secure_url?: string;
}

export async function uploadBackgroundImage(image: File) {
  const formData = new FormData();
  formData.append("image", image);

  const res = await api.post<BackgroundImageResponse>("/api/backgroundimage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
}

export async function getBackgroundImage() {
  const res = await api.get<BackgroundImageResponse>("/api/backgroundimage");
  return res.data;
}

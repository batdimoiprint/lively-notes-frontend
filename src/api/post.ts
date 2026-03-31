import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

export interface IGPost {
  _id: string;
  postID: number;
  caption: string;
  url: string;
  likesCount: number;
  ownerUsername: string;
  cloudinaryPics: {
    public_id: string;
    secure_url: string;
  }[];
}

export async function getIdolPosts() {
  const res = await api.get<IGPost[]>("/api/igpost/idol-posts", {
    headers: {
      "Cache-Control": "no-store, no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data;
}

export async function getNewestIdolPosts() {
  const res = await api.get<IGPost[]>("/api/igpost/newest-idol-posts", {
    headers: {
      "Cache-Control": "no-store, no-cache",
      Pragma: "no-cache",
    },
  });
  return res.data;
}

export async function getRandomPostByUsername(username: string) {
  const res = await api.get<IGPost>(`/api/igpost/random-post/${username}`);
  return res.data;
}

function msUntilNext8AM(): number {
  const now = new Date();
  const next8AM = new Date();
  next8AM.setHours(8, 0, 0, 0);

  if (now >= next8AM) {
    next8AM.setDate(next8AM.getDate() + 1);
  }

  return next8AM.getTime() - now.getTime();
}

export function useIdolPosts() {
  return useQuery<IGPost[]>({
    queryKey: ["igIdolPosts"],
    queryFn: getNewestIdolPosts,
    staleTime: msUntilNext8AM(),
    gcTime: 86400000,
    refetchOnWindowFocus: false,
  });
}

export async function runActorForUsername(username: string) {
  const res = await api.post("/api/apify/run-actor", {
    username,
  });

  return res.data;
}

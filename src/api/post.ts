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
  const res = await api.get<IGPost[]>("/api/igpost/idol-posts");
  return res.data;
}

export async function runActorForUsername(username: string) {
  const res = await api.post("/api/apify/run-actor", {
    username,
  });

  return res.data;
}

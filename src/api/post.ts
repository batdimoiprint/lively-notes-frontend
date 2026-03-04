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

export async function getPostTest() {
  try {
    const res = await api.get<IGPost>("/api/igpost");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}

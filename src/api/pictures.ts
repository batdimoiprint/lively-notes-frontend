import { useQuery } from "@tanstack/react-query";
import api from "./axiosInstance";

async function getSanaFolder() {
  const res = await api.get<number[]>("/api/images/folder/sana");
  return res.data;
}

async function getMomoFolder() {
  const res = await api.get<number[]>("/api/images/folder/momo");
  return res.data;
}

async function getLizFolder() {
  const res = await api.get<number[]>("/api/images/folder/liz");
  return res.data;
}

function useSanaPictures() {
  return useQuery({
    queryKey: ["sana_pics_id"],
    queryFn: getSanaFolder,
  });
}

function useMomoPictures() {
  return useQuery({
    queryKey: ["momo_pics_id"],
    queryFn: getMomoFolder,
  });
}

function useLizPictures() {
  return useQuery({
    queryKey: ["liz_pics_id"],
    queryFn: getLizFolder,
  });
}

export { useSanaPictures, useLizPictures, useMomoPictures };

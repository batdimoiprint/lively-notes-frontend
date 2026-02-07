import api from "./axiosInstance";

const url = "https://api.api-ninjas.com/v1/jokes";
const options = {
  headers: { "X-Api-Key": import.meta.env.VITE_QUOTES_API },
  method: "GET",
};

// Had to limit this on prod because of api limits lol
export default async function getJoke() {
  if (import.meta.env.PROD === true) {
    const res = await api.get(url, options);
    const response = await res.data;
    return response;
  } else {
    return null;
  }
}

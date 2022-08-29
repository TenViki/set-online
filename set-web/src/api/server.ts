import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export const httpRequest = async (url: string, method: HttpMethod, data?: object) => {
  const response = await api.request({
    url,
    method,
    data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

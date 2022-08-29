import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log(import.meta.env.VITE_BACKEND_URL);

type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

export const httpRequest = async <ReturnType>(
  url: string,
  method: HttpMethod,
  options?: {
    useToken?: boolean;
    data?: any;
  }
) => {
  const response = await api.request<ReturnType>({
    url,
    method,
    data: options?.data,
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

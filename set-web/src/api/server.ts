import axios from "axios";
import { TokenManager } from "../utils/tokenManager";

const currentDomain = window.location.origin;

console.log(currentDomain);

export const serverUrl = currentDomain.includes("109.183.118.22")
  ? "http://109.183.118.22:7000/"
  : import.meta.env.VITE_BACKEND_URL;

export const api = axios.create({
  baseURL: serverUrl,
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
    query?: any;
  }
) => {
  const response = await api.request<ReturnType>({
    url,
    method,
    data: options?.data,
    headers: {
      "Content-Type": "application/json",
      ...(options?.useToken && { Authorization: TokenManager.getToken() || undefined }),
    },
    params: options?.query,
  });
  return response.data;
};

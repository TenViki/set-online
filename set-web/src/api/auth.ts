import { UserType } from "../types/User.type";
import { httpRequest } from "./server";

export interface AuthResponse {
  token: string;
  user: UserType;
}

export const loginRequest = (data: { loginType: "PASSWORD"; username?: string; password?: string; rememberMe?: boolean }) => {
  return httpRequest<AuthResponse>("/auth/login", "post", { data });
};

export const signUpRequest = (data: { username: string; password: string; email: string; rememberMe: boolean }) => {
  return httpRequest<AuthResponse>("/auth/login/signup", "post", { data });
};

export const getUser = () => {
  return httpRequest<UserType>("/auth/me", "get", { useToken: true });
};

export const reuqestRecovery = (data: { email: string }) => {
  return httpRequest("/auth/recovery", "post", { data });
};

export const recoverAccount = (data: { token: string; password: string; selector: string }) => {
  return httpRequest(`/auth/recovery/${data.selector}`, "post", { data });
};

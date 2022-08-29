import { UserType } from "../types/User.type";
import { httpRequest } from "./server";

export interface AuthResponse {
  token: string;
  user: UserType;
}

export const loginRequest = (data: { loginType: "PASSWORD"; username?: string; password?: string; rememberMe?: boolean }) => {
  return httpRequest<AuthResponse>("/auth/login", "post", { data });
};

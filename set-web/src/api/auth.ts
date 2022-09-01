import { UserType } from "../types/User.type";
import { httpRequest } from "./server";

export type AuthResponse =
  | {
      token: string;
      user: UserType;
      success: true;
    }
  | {
      success: false;
      message: string;
      identifier: string;
      suggestedUsername: string;
    };

type LoginType = "PASSWORD" | "DISCORD" | "DISCORD_COMPLETE" | "GOOGLE" | "GOOGLE_COMPLETE";
interface LoginPayload {
  loginType: LoginType;
  password?: string;
  rememberMe?: boolean;
  username?: string;
  code?: string;
  state?: string;
  identifier?: string;
}

export const loginRequest = (data: LoginPayload) => {
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

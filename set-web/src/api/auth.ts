import { UserType } from "../types/User.type";

export interface AuthResponse {
  token: string;
  user: UserType;
}

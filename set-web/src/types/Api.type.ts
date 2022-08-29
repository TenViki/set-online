import { AxiosError } from "axios";

export type ApiError = AxiosError<{
  timestamp: number;
  status: number;
  error: {
    message: string;
    path: string;
  };
}>;

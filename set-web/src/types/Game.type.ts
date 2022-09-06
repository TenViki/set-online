export interface GameType {
  id: string;
  code: number;
  status: string;
  winner: string | null;
  created: Date;
  players: UserLowType[];
  host: UserLowType;
  limit: number;
  public: boolean;
}
export interface UserLowType {
  id: string;
  username: string;
  avatar: string;
}

export enum GameStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

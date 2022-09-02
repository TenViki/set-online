export interface GameType {
  id: string;
  code: number;
  status: string;
  winner: string | null;
  created: Date;
  players: UserLowType[];
  host: string;
  limit: number;
  public: boolean;
}
export interface UserLowType {
  id: string;
  username: string;
  avatar: string;
}

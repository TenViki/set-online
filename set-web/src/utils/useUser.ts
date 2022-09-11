import { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { UserContext } from "../App";
import { queryClient } from "../main";
import { UserType } from "../types/User.type";
import { TokenManager } from "./tokenManager";
import { useGame } from "./useGame";

export const useUser = ():
  | (UserType & {
      setUser: (user: UserType | null) => void;
      isLoggedIn: true;
    })
  | {
      isLoggedIn: false;
      isLoading: boolean;
      setUser: (user: UserType | null) => void;
    } => {
  const user = useContext(UserContext);
  const queryClient = useQueryClient();
  const userData = queryClient.getQueryState("user");

  if (user.user)
    return {
      ...user.user,
      isLoggedIn: true,
      setUser: user.setUser,
    };

  return {
    isLoggedIn: false,
    setUser: user.setUser,
    isLoading: userData?.isFetching || false,
  };
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUser();
  const game = useGame();

  return () => {
    queryClient.removeQueries("user");
    TokenManager.removeToken();
    toast.success("Logged out successfully");
    user.setUser(null);
    game.remove();
    navigate("/login");
  };
};

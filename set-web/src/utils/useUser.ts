import { useContext } from "react";
import { useQuery, useQueryClient } from "react-query";
import { UserContext } from "../App";
import { queryClient } from "../main";
import { UserType } from "../types/User.type";

export const useUser = ():
  | (UserType & {
      setUser: (user: UserType) => void;
      isLoggedIn: true;
    })
  | {
      isLoggedIn: false;
      isLoading: boolean;
      setUser: (user: UserType) => void;
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

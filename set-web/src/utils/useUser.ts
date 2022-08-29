import { useContext } from "react";
import { UserContext } from "../App";

export const useUser = () => {
  const user = useContext(UserContext);
  console.log(user);
  const usr = {
    ...(user.user || {}),
    isLoggedIn: !!user.user,
    setUser: user.setUser,
  };
  return usr;
};

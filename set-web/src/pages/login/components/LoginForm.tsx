import React, { FC } from "react";
import TextField from "../../../components/fields/TextField";
import { FiUser, FiLock } from "react-icons/fi";
import Button from "../../../components/button/Button";
import { FiChevronRight } from "react-icons/fi";
import Checkbox from "../../../components/fields/CheckBox";

interface LoginFormProps {
  username: string;
  setUsername: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error?: string;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
}

const LoginForm: FC<LoginFormProps> = ({ username, setUsername, password, setPassword, error, rememberMe, setRememberMe }) => {
  return (
    <form className="login-form">
      <TextField
        icon={FiUser}
        onChange={setUsername}
        placeholder={"Enter your username"}
        value={username}
        error={error?.toLowerCase().includes("username") ? error : ""}
        color="main"
      />

      <TextField
        icon={FiLock}
        onChange={setPassword}
        placeholder={"Enter your password"}
        value={password}
        error={error?.toLowerCase().includes("password") ? error : ""}
        color="main"
        type="password"
      />

      <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" />

      <Button text="Log in" rightIcon={FiChevronRight} fullwidth submit />
    </form>
  );
};

export default LoginForm;

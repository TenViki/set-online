import React, { FC } from "react";
import TextField from "../../../components/fields/TextField";
import { FiUser, FiLock } from "react-icons/fi";

interface LoginFormProps {
  username: string;
  setUsername: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  error?: string;
}

const LoginForm: FC<LoginFormProps> = ({ username, setUsername, password, setPassword, error }) => {
  return (
    <div className="login-form">
      <TextField
        icon={FiUser}
        onChange={setUsername}
        placeholder={"Enter your username"}
        value={username}
        error={error?.toLowerCase().includes("username") ? error : ""}
        color="main"
      />
    </div>
  );
};

export default LoginForm;

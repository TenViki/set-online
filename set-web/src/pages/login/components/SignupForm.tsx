import React, { FC } from "react";
import { FiAtSign, FiChevronRight, FiLock, FiUser } from "react-icons/fi";
import Button from "../../../components/button/Button";
import Checkbox from "../../../components/fields/Checkbox";
import TextField from "../../../components/fields/TextField";

interface SignupFormProps {
  username: string;
  setUsername: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  email: string;
  setEmail: (email: string) => void;
  error?: string;
  rememberMe: boolean;
  setRememberMe: (rememberMe: boolean) => void;
  onSubmit: () => void;
  loading?: boolean;
}

const SignupForm: FC<SignupFormProps> = ({
  email,
  password,
  username,
  rememberMe,
  setEmail,
  setPassword,
  setUsername,
  setRememberMe,
  error,
  onSubmit,
  loading,
}) => {
  return (
    <form
      className="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        icon={FiUser}
        onChange={setUsername}
        placeholder={"Enter your username"}
        value={username}
        error={error?.toLowerCase().includes("username") ? error : ""}
        color="success"
      />

      <TextField
        icon={FiAtSign}
        onChange={setEmail}
        placeholder={"Enter your email"}
        value={email}
        error={error?.toLowerCase().includes("email") ? error : ""}
        color="success"
      />

      <TextField
        icon={FiLock}
        onChange={setPassword}
        placeholder={"Enter your password"}
        value={password}
        error={error?.toLowerCase().includes("password") ? error : ""}
        color="success"
        type="password"
      />

      <Checkbox checked={rememberMe} onChange={setRememberMe} label="Remember me" color="success" />
      <Button text="Sign up" rightIcon={FiChevronRight} fullwidth submit color="success" loading={loading} />
    </form>
  );
};

export default SignupForm;

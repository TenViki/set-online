import React from "react";
import { FiChevronRight, FiLock } from "react-icons/fi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { recoverAccount } from "../../api/auth";
import Button from "../../components/button/Button";
import TextField from "../../components/fields/TextField";
import { ApiError } from "../../types/Api.type";
import "./Recovery.scss";

const Recovery = () => {
  const [password, setPassword] = React.useState("");

  const token = new URLSearchParams(window.location.search).get("token");
  const selector = new URLSearchParams(window.location.search).get("selector");

  const navigate = useNavigate();

  const recoverAccountMutation = useMutation(recoverAccount, {
    onError: (error: ApiError) => {
      toast.error(error?.response?.data.error.message || "Something went wrong");
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      navigate("/login");
    },
  });

  const onSubmit = async () => {
    if (!password) return toast.error("Please fill in all fields");

    if (!selector || !token) return toast.error("Invalid recovery link");

    recoverAccountMutation.mutate({ password, selector, token });
  };

  return (
    <div
      className="recovery-page"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h1>Recover your account</h1>

      <form className="login-form">
        <TextField
          placeholder="Change your password"
          color="danger"
          icon={FiLock}
          value={password}
          onChange={setPassword}
          type="password"
        />
        <Button submit fullwidth rightIcon={FiChevronRight} text="Update password" color="danger" />
      </form>
    </div>
  );
};

export default Recovery;

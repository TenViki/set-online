import React, { FC } from "react";
import { FiAtSign, FiChevronRight } from "react-icons/fi";
import Button from "../../../components/button/Button";
import TextField from "../../../components/fields/TextField";

interface ResetFormProps {
  email: string;
  setEmail: (email: string) => void;
  error?: string;
  onSubmit: () => void;
}

const ResetForm: FC<ResetFormProps> = ({ email, setEmail, error, onSubmit }) => {
  return (
    <form
      className="login-form"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <TextField
        icon={FiAtSign}
        onChange={setEmail}
        placeholder={"Enter your email"}
        value={email}
        error={error?.toLowerCase().includes("email") ? error : ""}
        color="danger"
      />
      <Button text="Recover account" rightIcon={FiChevronRight} fullwidth submit color="danger" />
    </form>
  );
};

export default ResetForm;

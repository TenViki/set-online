import React, { useEffect, useState } from "react";
import { FiAlertTriangle, FiCheckCircle, FiChevronRight, FiUser } from "react-icons/fi";
import { useMutation } from "react-query";
import { loginRequest } from "../../api/auth";
import Button from "../../components/button/Button";
import TextField from "../../components/fields/TextField";
import Loading from "../../components/loading/Loading";
import { ApiError } from "../../types/Api.type";
import "./Redirect.scss";

const DiscordRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const state = new URLSearchParams(window.location.search).get("state");

  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");

  const loginMutation = useMutation(loginRequest, {
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        setCurrent(1);
      } else {
        console.log(data);
        setCurrent(3);
        setUsername(data.suggestedUsername);
      }
    },
    onError: (error: ApiError) => {
      setCurrent(2);
      console.error(error);
      setError(error.response?.data.error.message || "Something went wrong");
    },
  });

  useEffect(() => {
    if (!code) return;

    loginMutation.mutate({ loginType: "DISCORD", code, state: state || undefined });
  }, []);

  if (!code) {
    return (
      <div className="redirect-page">
        <div className="redirect-error">
          <FiAlertTriangle />

          <div className="error-text">
            <div className="error-name">Invalid login grant</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="redirect-page">
      {current === 0 && (
        <div className="loading-text">
          <Loading size={3} />
          <span>Logging in...</span>
        </div>
      )}

      {current === 1 && (
        <div className="redirect-success">
          <FiCheckCircle />
          <span>Logged in successfully</span>
        </div>
      )}

      {current === 2 && (
        <div className="redirect-error">
          <FiAlertTriangle />

          <div className="error-text">
            <div className="error-name">Couldn't log in with discord</div>
            <div className="error-content">{error}</div>
          </div>
        </div>
      )}

      {current === 3 && (
        <div className="redirect-complete">
          <div className="redirect-complete-title">To create your account</div>
          <div className="redirect-complete-text">choose your username</div>

          <form className="login-form">
            <TextField
              color="main"
              placeholder="Choose a username"
              error={error?.toLocaleLowerCase().includes("username") ? error : undefined}
              icon={FiUser}
              onChange={setUsername}
              value={username}
            />

            <Button text="Sign up" color="main" submit fullwidth rightIcon={FiChevronRight} />
          </form>
        </div>
      )}
    </div>
  );
};

export default DiscordRedirect;

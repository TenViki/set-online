import React, { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { useMutation } from "react-query";
import { loginRequest } from "../../api/auth";
import Loading from "../../components/loading/Loading";
import { ApiError } from "../../types/Api.type";
import "./Redirect.scss";

const DiscordRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const state = new URLSearchParams(window.location.search).get("state");

  const [current, setCurrent] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation(loginRequest, {
    onSuccess: (data) => {
      if (data.success) {
        localStorage.setItem("token", data.token);
        setCurrent(1);
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
    return <div>Invalid login grant</div>;
  }

  return (
    <div className="redirect-page">
      {current === 0 && (
        <div className="loading-text">
          <Loading size={3} />
          <span>Logging in...</span>
        </div>
      )}

      {current === 2 && (
        <div className="redirect-error">
          <FiAlertTriangle />

          <div className="error-text">
            <div className="error-name">Couldn't log into discord</div>
            <div className="error-content">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscordRedirect;

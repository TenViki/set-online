import React, { useEffect } from "react";
import { useMutation } from "react-query";
import { loginRequest } from "../../api/auth";

const DiscordRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const state = new URLSearchParams(window.location.search).get("state");

  const loginMutation = useMutation(loginRequest);

  useEffect(() => {
    if (!code || !state) return;

    loginMutation.mutate({ loginType: "DISCORD", code, state });
  }, []);

  if (!code) {
    return <div>Invalid login grant</div>;
  }

  return (
    <div>
      Code: {code}
      State: {state}
    </div>
  );
};

export default DiscordRedirect;

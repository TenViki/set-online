import React from "react";

const DiscordRedirect = () => {
  const code = new URLSearchParams(window.location.search).get("code");
  const state = new URLSearchParams(window.location.search).get("state");

  return (
    <div>
      Code: {code}
      State: {state}
    </div>
  );
};

export default DiscordRedirect;

import React, { useContext, useEffect } from "react";
import { GameContext } from "../../App";
import "./InvitePopup.scss";

const InvitePopup = () => {
  const { socket } = useContext(GameContext);

  useEffect(() => {}, [socket]);

  return <div>InvitePopup</div>;
};

export default InvitePopup;

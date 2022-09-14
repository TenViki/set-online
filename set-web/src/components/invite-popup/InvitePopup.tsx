import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GameContext } from "../../App";
import { GameType, UserLowType } from "../../types/Game.type";
import Button from "../button/Button";
import { useModal } from "../modal/Modal";
import "./InvitePopup.scss";

const InvitePopup = () => {
  const { socket } = useContext(GameContext);
  const navigate = useNavigate();

  const { isOpen, toggle } = useModal();
  const [inviteData, setInviteData] = useState({
    code: "",
    host: "",
  });

  const handleInvite = (data: { game: GameType; user: UserLowType }) => {
    setInviteData({
      code: data.game.code + "",
      host: data.user.username,
    });
    toggle(true);
  };

  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket.on("invite", handleInvite);

    return () => {
      socket.off("invite", handleInvite);
    };
  }, [socket]);

  return (
    <div className={`invite-popup ${isOpen ? "opened" : ""}`}>
      <div className="invite-popup-text">{inviteData.host} invited you to join their game</div>

      <div className="invite-popup-buttons">
        <Button
          color="gray"
          text="Ignore"
          onClick={() => {
            toggle(false);
          }}
          variant="outlined"
        />
        <Button
          color="main"
          text="Join"
          onClick={() => {
            navigate(`/game/join/${inviteData.code}`);
            toggle(false);
          }}
        />
      </div>
    </div>
  );
};

export default InvitePopup;

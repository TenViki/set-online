import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { GameContext } from "../../App";
import { GameType, UserLowType } from "../../types/Game.type";
import { useGame } from "../../utils/useGame";
import { useUser } from "../../utils/useUser";
import Button from "../button/Button";
import Modal, { useModal } from "../modal/Modal";
import ModalButtons from "../modal/ModalButtons";
import "./InvitePopup.scss";

const InvitePopup = () => {
  const { socket } = useContext(GameContext);
  const navigate = useNavigate();

  const { isOpen, toggle } = useModal();
  const { isOpen: isModalOpen, toggle: toggleModal } = useModal();

  const { game } = useGame();
  const user = useUser();

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

  if (!user.isLoggedIn) return null;

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
            if (game) {
              toggleModal(true);
              return;
            }
            navigate(`/game/join/${inviteData.code}`);
            toggle(false);
          }}
        />
      </div>

      <Modal isOpen={isModalOpen} toggle={toggleModal} title={`${game?.host?.id === user.id ? "Delete" : "Leave"} game?`}>
        Do you really want to {game?.host?.id === user.id ? "delete" : "leave"} the game?
        <ModalButtons>
          <Button
            color="gray"
            text="Cancel"
            onClick={() => {
              toggleModal(false);
              toggle(false);
            }}
            variant="outlined"
          />

          <Button
            color="danger"
            text="Yes"
            onClick={() => {
              navigate(`/game/join/${inviteData.code}`);
              toggleModal(false);
              toggle(false);
            }}
          />
        </ModalButtons>
      </Modal>
    </div>
  );
};

export default InvitePopup;

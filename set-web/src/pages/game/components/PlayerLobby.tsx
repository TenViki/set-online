import React, { FC } from "react";
import { FiUser } from "react-icons/fi";
import Button from "../../../components/button/Button";
import { UserLowType } from "../../../types/Game.type";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import "./PlayerLobby.scss";

interface PlayerLobbyProps {
  user?: UserLowType;
}

const PlayerLobby: FC<PlayerLobbyProps> = ({ user }) => {
  const game = useGame();
  const usr = useUser();

  const gameHostId = game.game?.host.id;

  return (
    <div
      className={`game-lobby-player ${!user ? "empty" : ""} ${
        usr.isLoggedIn && usr.id === gameHostId && user && usr.id !== user.id ? "hoverable" : ""
      }`}
    >
      <div className="game-lobby-player-avatar">
        <FiUser />
      </div>
      <div className="game-lobby-player-name">{user?.username || "Waiting for player..."}</div>

      {user && gameHostId === user.id && <div className="game-lobby-player-host">Host</div>}
    </div>
  );
};

export default PlayerLobby;

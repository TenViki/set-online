import React, { FC } from "react";
import { FiUser } from "react-icons/fi";
import { UserLowType } from "../../../types/Game.type";
import { getAvatar } from "../../../utils/files.util";
import "./PlayerInGame.scss";

interface PlayerInGameProps {
  user: UserLowType;
  isHost: boolean;
  isMe: boolean;
  score: number;
  rf?: (element: HTMLDivElement) => void;
}

const PlayerInGame: FC<PlayerInGameProps> = ({ isHost, isMe, score, user, rf }) => {
  return (
    <div className={`game-player ${isMe && "me"} ${isHost && "host"}`} ref={rf}>
      <div className="game-player-avatar">{user.avatar ? <img src={getAvatar(user.avatar)} alt="avatar" /> : <FiUser />}</div>

      <div className="game-player-text">
        <div className="game-player-username text">{user.username}</div>
        <div className="game-player-score">{score}</div>
      </div>
    </div>
  );
};

export default PlayerInGame;

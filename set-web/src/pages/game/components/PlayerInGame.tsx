import React, { FC } from "react";
import { FiCheck, FiUser } from "react-icons/fi";
import { UserLowType } from "../../../types/Game.type";
import { getAvatar } from "../../../utils/files.util";
import "./PlayerInGame.scss";

interface PlayerInGameProps {
  user: UserLowType;
  isHost: boolean;
  isMe: boolean;
  score: number;
  rf?: (element: HTMLDivElement) => void;
  ping?: number;
  hasVoted: boolean;
  timer: boolean;
}

const PlayerInGame: FC<PlayerInGameProps> = ({ isHost, isMe, score, user, rf, ping, hasVoted, timer }) => {
  return (
    <div className="game-player-wrapper">
      <div className={`game-player ${isMe && "me"} ${isHost && "host"}`} ref={rf}>
        <div className="game-player-avatar">{user.avatar ? <img src={getAvatar(user.avatar)} alt="avatar" /> : <FiUser />}</div>

        <div className="game-player-text">
          <div className="game-player-username text">{user.username}</div>
          <div className="game-player-score">{score}</div>
        </div>
        {ping && <div className="game-player-ping">{ping} ms</div>}
        {hasVoted && (
          <div className="game-player-voted">
            <FiCheck />
          </div>
        )}
      </div>

      <div className={`game-player-timer ${timer && "active"}`}>
        <div className="game-player-timer-bar" />
      </div>
    </div>
  );
};

export default PlayerInGame;

import React, { FC } from "react";
import { FiCheck, FiUser } from "react-icons/fi";
import { useMutation } from "react-query";
import { GameStatus, UserLowType } from "../../../types/Game.type";
import { getAvatar } from "../../../utils/files.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
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
  onKick?: (player: UserLowType) => void;
}

const PlayerInGame: FC<PlayerInGameProps> = ({ isHost, isMe, score, user, rf, ping, hasVoted, timer, onKick }) => {
  const game = useGame();
  const mainUser = useUser();

  const canKick =
    mainUser.isLoggedIn && mainUser?.id === game.game?.host.id && game.game.status === GameStatus.IN_PROGRESS && !isMe;

  return (
    <div className={`game-player-wrapper`}>
      <div
        className={`game-player ${isMe && "me"} ${isHost && "host"} ${canKick ? "hoverable" : ""}`}
        onClick={() => {
          if (canKick) onKick?.(user);
        }}
        ref={rf}
      >
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

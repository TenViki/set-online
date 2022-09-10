import React, { FC } from "react";
import { FiUser } from "react-icons/fi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { leaveGameRequest } from "../../../api/game";
import { ApiError } from "../../../types/Api.type";
import { GameType } from "../../../types/Game.type";
import GameControls from "../components/GameControls";
import PlayerLobby from "../components/PlayerLobby";
import "./NotStarted.scss";

interface NotStartedProps {
  game: GameType;
}

const NotStarted: FC<NotStartedProps> = ({ game }) => {
  return (
    <div className="game-lobby">
      <div className="game-lobby-players">
        <div className="game-lobby-players-grid">
          {game.players.map((player) => (
            <PlayerLobby user={player} key={player.id} />
          ))}

          {new Array(game.limit - game.players.length).fill(0).map((_, i) => (
            <PlayerLobby key={i} />
          ))}
        </div>
      </div>

      <div className="game-lobby-controls">
        <GameControls />
      </div>
    </div>
  );
};

export default NotStarted;

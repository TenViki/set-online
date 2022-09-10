import React, { FC, useContext } from "react";
import { FiChevronRight, FiCopy, FiLink, FiLogOut, FiTrash, FiUserPlus } from "react-icons/fi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { leaveGameRequest } from "../../../api/game";
import { GameContext } from "../../../App";
import Button from "../../../components/button/Button";
import { ApiError } from "../../../types/Api.type";
import { GameType } from "../../../types/Game.type";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import "./GameControls.scss";

const GameControls = () => {
  const game = useGame();
  const user = useUser();

  const { setGame } = useContext(GameContext);

  const navigate = useNavigate();

  const leaveGameMutation = useMutation(leaveGameRequest, {
    onSuccess: () => {
      setGame(null);
      navigate("/");
    },
    onError: (err: ApiError) => {
      toast.error(err.response?.data.error.message || "Something went wrong");
    },
  });

  if (user.isLoggedIn && game.game?.host.id === user.id)
    return (
      <div className="lobby-game-controls">
        <div className="lobby-game-controls-buttons">
          <Button
            color="danger"
            text="Delete game"
            leftIcon={FiTrash}
            loading={leaveGameMutation.isLoading}
            onClick={() => leaveGameMutation.mutate()}
          />
          <Button color="gray" text="Invite players" leftIcon={FiUserPlus} />
          <Button color="gray" text="Copy join link" leftIcon={FiLink} />
          <Button color="gray" text="Copy game code" leftIcon={FiCopy} />
          <div className="lobby-game-code text">
            Game code:
            <span>{game.game?.code}</span>
          </div>
        </div>
        <div className="lobby-game-controls-start">
          <Button color="success" text="Start game" rightIcon={FiChevronRight} />
        </div>
      </div>
    );
  else {
    return (
      <div className="lobby-game-controls">
        <div className="lobby-game-controls-buttons">
          <Button
            color="danger"
            text="Leave"
            leftIcon={FiLogOut}
            loading={leaveGameMutation.isLoading}
            onClick={() => leaveGameMutation.mutate()}
          />
          <div className="lobby-game-code text">
            Game code:
            <span>{game.game?.code}</span>
          </div>
        </div>
        <div className="lobby-game-controls-waiting">Waiting for host to start...</div>
      </div>
    );
  }
};

export default GameControls;

import React, { FC } from "react";
import { FiChevronRight, FiCopy, FiLink, FiLogOut, FiUserPlus } from "react-icons/fi";
import Button from "../../../components/button/Button";
import { GameType } from "../../../types/Game.type";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import "./GameControls.scss";

const GameControls = () => {
  const game = useGame();
  const user = useUser();

  if (user.isLoggedIn && game.game?.host.id === user.id)
    return (
      <div className="lobby-game-controls">
        <div className="lobby-game-controls-buttons">
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
          <Button color="danger" text="Leave" leftIcon={FiLogOut} />
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

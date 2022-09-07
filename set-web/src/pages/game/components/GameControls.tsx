import React from "react";
import { FiChevronRight, FiCopy, FiLink, FiUserPlus } from "react-icons/fi";
import Button from "../../../components/button/Button";
import "./GameControls.scss";

const GameControls = () => {
  return (
    <div className="lobby-game-controls">
      <div className="lobby-game-controls-buttons">
        <Button color="gray" text="Invite people" leftIcon={FiUserPlus} />
        <Button color="gray" text="Copy game code" leftIcon={FiCopy} />
        <Button color="gray" text="Copy join link" leftIcon={FiLink} />
      </div>
      <div className="lobby-game-controls-start">
        <Button color="success" text="Start game" rightIcon={FiChevronRight} />
      </div>
    </div>
  );
};

export default GameControls;

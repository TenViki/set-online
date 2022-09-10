import React, { FC } from "react";
import { FiChevronRight, FiUser } from "react-icons/fi";
import { useMutation } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { kickPlayerRequest, leaveGameRequest } from "../../../api/game";
import Button from "../../../components/button/Button";
import Modal, { useModal } from "../../../components/modal/Modal";
import ModalButtons from "../../../components/modal/ModalButtons";
import { ApiError } from "../../../types/Api.type";
import { GameType, UserLowType } from "../../../types/Game.type";
import GameControls from "../components/GameControls";
import PlayerLobby from "../components/PlayerLobby";
import "./NotStarted.scss";

interface NotStartedProps {
  game: GameType;
}

const NotStarted: FC<NotStartedProps> = ({ game }) => {
  const { isOpen, toggle } = useModal();
  const [playerToKick, setPlayerToKick] = React.useState<UserLowType | null>(null);

  const handleUserClick = (user: UserLowType) => {
    setPlayerToKick(user);
    toggle(true);
  };

  const kickUserMutation = useMutation(kickPlayerRequest, {
    onSuccess: () => {
      toggle(false);
    },
  });

  return (
    <div className="game-lobby">
      <div className="game-lobby-players">
        <div className="game-lobby-players-grid">
          {game.players.map((player) => (
            <PlayerLobby user={player} key={player.id} onClick={handleUserClick} />
          ))}

          {new Array(game.limit - game.players.length).fill(0).map((_, i) => (
            <PlayerLobby key={i} />
          ))}
        </div>
      </div>

      <div className="game-lobby-controls">
        <GameControls />
      </div>

      <Modal isOpen={isOpen} toggle={toggle} title={`Kick ${playerToKick?.username}?`}>
        <p>Are you sure you want to kick {playerToKick?.username}?</p>
        <ModalButtons>
          <Button color="gray" text="Cancel" onClick={() => toggle()} />
          <Button
            color="danger"
            text="Kick"
            rightIcon={FiChevronRight}
            onClick={() => playerToKick && kickUserMutation.mutate(playerToKick.id)}
            loading={kickUserMutation.isLoading}
          />
        </ModalButtons>
      </Modal>
    </div>
  );
};

export default NotStarted;

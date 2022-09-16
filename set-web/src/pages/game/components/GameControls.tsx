import React, { FC, useContext, useState } from "react";
import { FiChevronRight, FiCopy, FiLink, FiLogOut, FiTrash, FiUserPlus } from "react-icons/fi";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { leaveGameRequest, startGameRequest } from "../../../api/game";
import { GameContext } from "../../../App";
import Button from "../../../components/button/Button";
import Modal, { useModal } from "../../../components/modal/Modal";
import ModalButtons from "../../../components/modal/ModalButtons";
import { ApiError } from "../../../types/Api.type";
import { GameType } from "../../../types/Game.type";
import { copyToClipboard } from "../../../utils/copy.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import "./GameControls.scss";
import InvitePlayers from "./InvitePlayers";

const GameControls = () => {
  const game = useGame();
  const user = useUser();

  const queryClient = useQueryClient();

  const { setGame } = useContext(GameContext);
  const [invitePlayersOpened, setInvitePlayersOpened] = useState(false);

  const startGameMutation = useMutation(startGameRequest);

  const leaveGameMutation = useMutation(leaveGameRequest, {
    onSuccess: () => {
      console.log("Setting game null");
      // clear queryclient cache

      queryClient.removeQueries("game");

      setGame(null);
      toggle(false);
    },
    onError: (err: ApiError) => {
      toast.error(err.response?.data.error.message || "Something went wrong");
    },
  });

  const { isOpen, toggle } = useModal();

  if (user.isLoggedIn && game.game?.host.id === user.id)
    return (
      <div className="lobby-game-controls">
        <div className="lobby-game-controls-buttons">
          <Button
            color="danger"
            text="Delete game"
            leftIcon={FiTrash}
            loading={leaveGameMutation.isLoading}
            onClick={() => toggle()}
          />
          <div className="invite-players-wrapper">
            <Button
              color="gray"
              text="Invite players"
              leftIcon={FiUserPlus}
              onClick={() => setInvitePlayersOpened(!invitePlayersOpened)}
            />
            <InvitePlayers isOpen={invitePlayersOpened} onClose={() => setInvitePlayersOpened(false)} />
          </div>
          <Button
            color="gray"
            text="Copy join link"
            leftIcon={FiLink}
            onClick={() => {
              copyToClipboard(window.location.href + "/join/" + game.game?.code);
              toast.success("Copied to clipboard");
            }}
          />
          <Button
            color="gray"
            text="Copy game code"
            leftIcon={FiCopy}
            onClick={() => {
              copyToClipboard(game.game?.code + "");
              toast.success("Copied to clipboard");
            }}
          />
          <div className="lobby-game-code text">
            Game code:
            <span>{game.game?.code}</span>
          </div>
        </div>
        <div className="lobby-game-controls-start">
          <Button
            color="success"
            text="Start game"
            rightIcon={FiChevronRight}
            onClick={() => {
              startGameMutation.mutate();
            }}
            loading={startGameMutation.isLoading}
            disabled={game.game?.players.length < 2}
          />
        </div>

        <Modal toggle={toggle} isOpen={isOpen} title="Really?">
          Do you really want to delete the game?
          <ModalButtons>
            <Button color="gray" text="Cancel " onClick={() => toggle(false)} />
            <Button
              leftIcon={FiTrash}
              rightIcon={FiChevronRight}
              color="danger"
              text="Delete game"
              onClick={() => leaveGameMutation.mutate()}
              loading={leaveGameMutation.isLoading}
            />
          </ModalButtons>
        </Modal>
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
            onClick={() => toggle()}
          />
          <div className="lobby-game-code text">
            Game code:
            <span>{game.game?.code}</span>
          </div>
        </div>
        <div className="lobby-game-controls-waiting">Waiting for host to start...</div>

        <Modal toggle={toggle} isOpen={isOpen} title="Really?">
          Do you really want to leave this game?
          <ModalButtons>
            <Button color="gray" text="Cancel " onClick={() => toggle(false)} />
            <Button
              leftIcon={FiLogOut}
              rightIcon={FiChevronRight}
              color="danger"
              text="Yes, leave"
              onClick={() => leaveGameMutation.mutate()}
              loading={leaveGameMutation.isLoading}
            />
          </ModalButtons>
        </Modal>
      </div>
    );
  }
};

export default GameControls;

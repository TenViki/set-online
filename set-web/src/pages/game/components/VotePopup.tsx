import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { voteForNoSet } from "../../../api/game";
import Button from "../../../components/button/Button";
import { useModal } from "../../../components/modal/Modal";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";

interface VotePopupProps {
  remainingCards: number;
  voteData: {
    voted: string[];
    treshold: number;
  };
}

const VotePopup: React.FC<VotePopupProps> = ({ remainingCards, voteData }) => {
  const { isOpen, toggle } = useModal();
  const { socket } = useGame();
  const user = useUser();
  const { game } = useGame();

  useEffect(() => {
    toggle(!!voteData.voted.length);
  }, [voteData]);

  const newCardsMutation = useMutation(voteForNoSet);

  if (!user.isLoggedIn || !voteData || !game) return null;
  return (
    <div className={`invite-popup ${isOpen ? "opened" : ""}`}>
      <div className="invite-popup-text">
        {voteData.voted.length}/{Math.ceil(game.players.length * voteData.treshold)} players voted for{" "}
        {remainingCards ? "new cards" : "end of the game"}
      </div>

      <div className="invite-popup-buttons">
        <Button
          text={voteData.voted.includes(user.id) ? "Revoke vote" : "Vote"}
          color={voteData.voted.includes(user.id) ? "gray" : "success"}
          onClick={() => newCardsMutation.mutate()}
        />
      </div>
    </div>
  );
};

export default VotePopup;

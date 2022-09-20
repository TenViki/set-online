import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import { voteForNoSet } from "../../../api/game";
import Button from "../../../components/button/Button";
import { useModal } from "../../../components/modal/Modal";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";

interface VotePopupProps {
  remainingCards: number;
}

const VotePopup: React.FC<VotePopupProps> = ({ remainingCards }) => {
  const { isOpen, toggle } = useModal();
  const { socket } = useGame();
  const user = useUser();
  const { game } = useGame();
  const [voteData, setVoteData] = useState<{
    voted: string[];
    treshold: number;
  }>({
    voted: [],
    treshold: 0,
  });

  const handleSomeoneVoted = (data: { voted: string[]; treshold: number }) => {
    toggle(!!data.voted.length);
    setVoteData(data);
  };

  useEffect(() => {
    if (!socket) return;

    socket.on("no-set-vote", handleSomeoneVoted);

    return () => {
      socket.off("no-set-vote", handleSomeoneVoted);
    };
  }, [socket]);

  useEffect(() => {
    if (!game) return;

    if (game?.noSetVotes?.length) {
      toggle(true);
      setVoteData({
        voted: game.noSetVotes,
        treshold: 0.8,
      });
    }
  }, [game]);

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

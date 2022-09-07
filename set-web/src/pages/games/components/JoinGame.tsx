import React, { useContext } from "react";
import TextField from "../../../components/fields/TextField";
import { TbNumbers } from "react-icons/tb";
import Button from "../../../components/button/Button";
import { FiChevronRight } from "react-icons/fi";
import "./JoinGame.scss";
import { useMutation } from "react-query";
import { joinGameRequest } from "../../../api/game";
import { useNavigate } from "react-router";
import { useGame } from "../../../utils/useGame";
import { GameContext } from "../../../App";
import { toast } from "react-toastify";
import { ApiError } from "../../../types/Api.type";

const JoinGame = () => {
  const [gameCode, setGameCode] = React.useState("");

  const { setGame } = useContext(GameContext);

  const navigate = useNavigate();

  const joinGameMutation = useMutation(joinGameRequest, {
    onSuccess: (data) => {
      setGame(data);
      toast.success("Game joined");
      navigate(`/game`);
    },
    onError: (_: ApiError) => {},
  });

  const handleJoinGame = () => {
    joinGameMutation.mutate({
      code: gameCode,
    });
  };

  return (
    <form
      className="join-game-form"
      onSubmit={(e) => {
        e.preventDefault();
        handleJoinGame();
      }}
    >
      <TextField
        placeholder="Enter game code"
        value={gameCode}
        onChange={setGameCode}
        color="success"
        icon={TbNumbers}
        error={joinGameMutation.error?.response?.data.error.message}
      />
      <Button color="success" rightIcon={FiChevronRight} text="Join game" fullwidth submit loading={joinGameMutation.isLoading} />
    </form>
  );
};

export default JoinGame;

import React, { useContext, useEffect } from "react";
import { useMutation } from "react-query";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { joinGameRequest } from "../../api/game";
import { GameContext } from "../../App";
import Loading from "../../components/loading/Loading";
import Page from "../../components/page/Page";
import { ApiError } from "../../types/Api.type";

const JoinGame = () => {
  const { code } = useParams<{ code: string }>();
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

  useEffect(() => {
    joinGameMutation.mutate({
      code: code,
    });
  }, []);

  return (
    <Page>
      {joinGameMutation.error ? (
        <div>
          <h1>Error joining game - {joinGameMutation.error.response?.data.error.message || "Something went wrong"}</h1>
        </div>
      ) : (
        <div className="loading-text">
          <Loading size={3} />
          <span>Joining game</span>
        </div>
      )}
    </Page>
  );
};

export default JoinGame;

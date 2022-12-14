import React, { CSSProperties, useEffect, useRef, useState } from "react";
import { FiChevronRight } from "react-icons/fi";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { kickPlayerRequest, voteForNoSet } from "../../../api/game";
import Button from "../../../components/button/Button";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import Modal, { useModal } from "../../../components/modal/Modal";
import ModalButtons from "../../../components/modal/ModalButtons";
import { UserLowType } from "../../../types/Game.type";
import { idToCard, transformPoints, wait } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { usePing } from "../../../utils/usePing";
import { useUser } from "../../../utils/useUser";
import GameLog, { useGameLog } from "../components/GameLog";
import PlayerInGame from "../components/PlayerInGame";
import VotePopup from "../components/VotePopup";
import "./InProgress.scss";

type MovingCardsType = {
  [id: string]: number;
};

type DisappearingCardsType = {
  [id: string]: string;
};

const SET_TIME_OUT = 2500;

const useTimer = (time: number) => {
  const [running, setRunning] = useState(false);
  const [id, setId] = useState<string | null>(null);
  const [endedOnTime, setEndedOnTime] = useState(false);
  const [timerId, setTimerId] = useState<number | null>(null);

  const trigger = (id: string) => {
    setRunning(true);
    setEndedOnTime(false);
    setId(id);
    let timerId = setTimeout(() => {
      setEndedOnTime(true);
      setRunning(false);
    }, time);

    console.log("Setting timer id", timerId);

    setTimerId(timerId);
  };

  const cancel = () => {
    setRunning(false);

    console.log("Clearing timer id", timerId);
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
  };

  return { trigger, running, id, setId, cancel, endedOnTime, timerId };
};

const InProgress = () => {
  const { game, setGame, socket } = useGame();
  const { addLog, log } = useGameLog();
  const user = useUser();

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

  const { trigger, running, id, setId, cancel, endedOnTime, timerId } = useTimer(SET_TIME_OUT);

  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardSlots = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});
  const playerSlots = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const [selectedCards, setSelectedCards] = React.useState<string[]>([]);
  const [cardsToDisappear, setCardsToDisappear] = React.useState<DisappearingCardsType>({});
  const [movingCards, setMovingCards] = React.useState<MovingCardsType>({});
  const [newCards, setNewCards] = React.useState<string[]>([]);

  const [noneCards, setNoneCards] = React.useState<string[]>([]);
  const deckSlot = useRef<HTMLDivElement>(null);

  if (!game || !user.isLoggedIn || !game.laidOut) return null;
  const [userPoints, setUserPoints] = React.useState<{ [key: string]: number }>(transformPoints(game.points));
  const [remainingCards, setRemainingCards] = React.useState(81);

  const removeCards = async (sCards: string[], user: string) => {
    if (!game.laidOut) return;
    sCards.sort((a, b) => game.laidOut!.indexOf(a) - game.laidOut!.indexOf(b));

    await wait(300);
    setCardsToDisappear({
      [sCards[0]]: user,
      [sCards[1]]: user,
      [sCards[2]]: user,
    });
    await wait(400);

    setNoneCards(sCards);

    const movingCardsObj: MovingCardsType = {};

    const card1 = game.laidOut[game.laidOut.length - 3];
    const card2 = game.laidOut[game.laidOut.length - 2];
    const card3 = game.laidOut[game.laidOut.length - 1];

    const lastCards = [card1, card2, card3];

    const freeSlots = sCards
      .filter((c) => game.laidOut!.indexOf(c) < game.laidOut!.length - 3)
      .map((c) => game.laidOut?.indexOf(c));

    for (const card of lastCards) {
      if (sCards.includes(card)) continue;
      const freeSlot = freeSlots.shift();
      if (freeSlot === undefined) break;
      movingCardsObj[card] = freeSlot;
    }

    setMovingCards(movingCardsObj);

    await wait(300);
    setGame((game) => {
      if (!game) return null;

      const newLaidOut = game.laidOut;
      if (newLaidOut) {
        // newLaidOut.splice(newLaidOut.length - 3, 3);

        for (const card in movingCardsObj) {
          newLaidOut[movingCardsObj[card]] = card;
        }
      }

      return {
        ...game,
        laidOut: newLaidOut ?? null,
      };
    });

    await wait(100);
    setNoneCards([]);

    setGame((game) => {
      if (!game) return null;

      return {
        ...game,
        laidOut: game.laidOut?.slice(0, game.laidOut.length - 3) ?? null,
      };
    });

    setCardsToDisappear({});
    setMovingCards({});
  };

  const handleCardSelect = async () => {
    if (!socket) return;
    socket.emit("set", { cards: selectedCards });
    cancel();
    setSelectedCards([]);
  };

  useEffect(() => {
    if (!selectedCards.length) return;

    if (selectedCards.length === 3) handleCardSelect();
  }, [selectedCards, socket, timerId]);

  useEffect(() => {
    if (!cardWrapperRef.current) return;
    setCardsToDisappear({});
  }, [cardSlots]);

  const colLength = 3;
  const keyMap: { [s: string]: number | null } = {
    "7": 0,
    "4": 1,
    "1": 2,

    "8": colLength,
    "5": colLength + 1,
    "2": colLength + 2,

    "9": colLength * 2,
    "6": colLength * 2 + 1,
    "3": colLength * 2 + 2,

    Home: colLength * 3,
    ArrowLeft: colLength * 3 + 1,
    End: colLength * 3 + 2,

    ArrowUp: colLength * 4,
    Clear: colLength * 4 + 1,
    ArrowDown: colLength * 4 + 2,

    PageUp: colLength * 5,
    ArrowRight: colLength * 5 + 1,
    PageDown: colLength * 5 + 2,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // if keypad 1-9 is pressed
      // if (e.key >= "1" && e.key <= "9") {
      if (e.key in keyMap) {
        if (!game.laidOut) return;
        const index = keyMap[e.key];
        if (index === null || index >= game.laidOut.length) return;
        const card = game.laidOut[index];

        if (selectedCards.length >= 3) return;

        if (selectedCards.includes(card)) {
          setSelectedCards((prev) => prev.filter((c) => c !== card));
          socket?.emit("unselect-card", { card });
        } else {
          setSelectedCards((prev) => [...prev, card]);
          socket?.emit("select-card", { card });
        }
      } else {
        console.log(e.key);
      }
      // }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCards]);

  const handleSetError = (data: { user: string; points: number }) => {
    cancel();
    const username = game.players.find((user) => user.id === data.user)?.username;
    addLog(`**${username}** failed to find a set *(${data.points} points)*`, "error");

    setUserPoints((prev) => ({ ...prev, [data.user]: data.points }));
  };

  const handleSet = (data: { user: string; set: string[]; laidOut: string[]; points: number }) => {
    cancel();
    removeCards(data.set, data.user);
    setUserPoints((prev) => ({ ...prev, [data.user]: data.points }));

    const username = game.players.find((user) => user.id === data.user)?.username;
    addLog(`**${username}** found a set *(${data.points} points)*`);
  };

  const handleNewCards = async (data: { laidOut: string[]; newCards: string[]; remaining: number }) => {
    addLog(`Drawed new cards *(${data.remaining} remaining in deck)*`);
    setGame((game) => {
      if (!game) return null;

      return {
        ...game,
        laidOut: game.laidOut ? [...game.laidOut, ...data.newCards] : null,
      };
    });

    setRemainingCards(data.remaining);

    setNewCards(data.newCards);
    await wait(100);
    setNewCards([]);
    setNoneCards([]);
  };

  const [playerSelectedCards, setPlayerSelectedCards] = useState<string[]>([]);

  const handlePlayerCardSelect = (data: { user: string; card: string }) => {
    if ((playerSelectedCards.length === 0 && data.user !== user.id) || (selectedCards.length === 1 && data.user === user.id)) {
      console.log(playerSelectedCards.length, selectedCards.length);
      trigger(data.user);
    }
    if (data.user === user.id) return;
    setPlayerSelectedCards((prev) => [...prev, data.card]);
  };

  const handleUnselectPlayerCard = (data: { user: string; card: string }) => {
    if (data.user === user.id) return;
    setPlayerSelectedCards((prev) => prev.filter((c) => c !== data.card));
  };

  const [voteData, setVoteData] = useState<{
    voted: string[];
    treshold: number;
  }>({
    voted: [],
    treshold: 0,
  });

  const handleSomeoneVoted = (data: { voted: string[]; treshold: number }) => {
    setVoteData(data);
  };

  useEffect(() => {
    if (!game) return;

    if (game?.noSetVotes?.length) {
      setVoteData({
        voted: game.noSetVotes,
        treshold: 0.8,
      });
    }
  }, [game]);

  useEffect(() => {
    if (!running) {
      if (id === user.id) {
        setSelectedCards([]);
        if (endedOnTime) {
          socket?.emit("set", {
            timeout: true,
          });
        }
      } else setPlayerSelectedCards([]);

      setId(null);
    }
  }, [running, id, endedOnTime]);

  useEffect(() => {
    if (!socket) return;

    socket.on("set-error", handleSetError);
    socket.on("set-success", handleSet);
    socket.on("new-cards", handleNewCards);
    socket.on("select-card", handlePlayerCardSelect);
    socket.on("unselect-card", handleUnselectPlayerCard);
    socket.on("no-set-vote", handleSomeoneVoted);

    return () => {
      socket.off("set-error", handleSetError);
      socket.off("set-success", handleSet);
      socket.off("new-cards", handleNewCards);
      socket.off("select-card", handlePlayerCardSelect);
      socket.off("unselect-card", handleUnselectPlayerCard);
      socket.off("no-set-vote", handleSomeoneVoted);
    };
  }, [socket, game.laidOut, running, timerId, playerSelectedCards, selectedCards]);

  useEffect(() => {
    if (playerSelectedCards.length >= 3) {
      setTimeout(() => {
        setPlayerSelectedCards([]);
      }, 300);
    }
  }, [playerSelectedCards]);

  const newCardsMutation = useMutation(voteForNoSet);
  const ping = usePing();

  return (
    <div className="game-wrapper">
      <div
        className="game-cards"
        style={{ "--columns": Math.ceil((game.laidOut?.length || 0) / 3) } as CSSProperties}
        ref={cardWrapperRef}
      >
        {game.laidOut?.map((_, i) => {
          if (!game.laidOut) return null;
          const rowLength = game.laidOut.length / 3;

          const column = i % rowLength;
          const row = Math.floor(i / rowLength);
          const id = column * 3 + row;

          return <div className="card-slot" ref={(ref) => (cardSlots.current[id] = ref)} key={i} />;
        })}
      </div>

      <div className="game-cards-elements">
        {game.laidOut?.map((card, i) => (
          <div
            className={`game-card-wrapper ${selectedCards.includes(card) && "active"} ${
              card in cardsToDisappear && "disappear"
            } ${noneCards.includes(card) && "none"} ${playerSelectedCards.includes(card) && "player-selected"} ${
              running && id !== user.id && "disabled"
            }`}
            onClick={() => {
              if (running && id !== user.id) return;
              if (selectedCards.includes(card)) {
                socket?.emit("unselect-card", { card });
                return setSelectedCards(selectedCards.filter((c) => c !== card));
              }
              if (selectedCards.length === 3) return;
              if (Object.keys(movingCards).length) return;
              setSelectedCards((prev) => [...prev, card]);
              socket?.emit("select-card", { card });
            }}
            style={
              {
                "--x": newCards.includes(card)
                  ? deckSlot.current?.offsetLeft
                  : card in cardsToDisappear && !noneCards.includes(card)
                  ? playerSlots.current[cardsToDisappear[card]]?.offsetLeft
                  : cardSlots.current[movingCards[card] ?? i]?.offsetLeft,
                "--y": newCards.includes(card)
                  ? deckSlot.current?.offsetTop
                  : card in cardsToDisappear && !noneCards.includes(card)
                  ? playerSlots.current[cardsToDisappear[card]]?.offsetTop
                  : cardSlots.current[movingCards[card] ?? i]?.offsetTop,
              } as CSSProperties
            }
            key={i}
          >
            <CardRenderer key={i} props={idToCard(card)} />
          </div>
        ))}
      </div>

      <GameLog log={log} />

      <div className="game-players">
        <div className="game-players-list">
          {game.players.map((player) => (
            <PlayerInGame
              timer={player.id === id}
              key={player.id}
              user={player}
              isHost={player.id === game.host.id}
              isMe={user.id === player.id}
              ping={user.id === player.id ? ping.ping : undefined}
              score={userPoints[player.id] || 0}
              rf={(ref) => {
                playerSlots.current[player.id] = ref;
              }}
              hasVoted={voteData.voted.includes(player.id)}
              onKick={handleUserClick}
            />
          ))}

          <Button
            text={remainingCards > 0 ? "Vote for new cards" : "Vote for game end"}
            onClick={() => {
              newCardsMutation.mutate();
            }}
            disabled={game.laidOut.length >= 21}
          />

          <div className="deck-slot" ref={deckSlot}>
            <div className="deck-slot-inner">
              <div className="deck-slot-logo">SET!</div>
              <div className="deck-slot-cards">{remainingCards} / 81</div>
            </div>
          </div>
        </div>
      </div>

      <VotePopup remainingCards={remainingCards} voteData={voteData} />

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

export default InProgress;

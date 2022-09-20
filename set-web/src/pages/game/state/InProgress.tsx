import React, { CSSProperties, useEffect, useRef } from "react";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { voteForNoSet } from "../../../api/game";
import Button from "../../../components/button/Button";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { UserLowType } from "../../../types/Game.type";
import { idToCard, transformPoints, wait } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import PlayerInGame from "../components/PlayerInGame";
import VotePopup from "../components/VotePopup";
import "./InProgress.scss";

type MovingCardsType = {
  [id: string]: number;
};

type DisappearingCardsType = {
  [id: string]: string;
};

const InProgress = () => {
  const { game, setGame, socket } = useGame();
  const user = useUser();

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
    setSelectedCards([]);
  };

  useEffect(() => {
    if (!selectedCards.length) return;

    if (selectedCards.length === 3) handleCardSelect();
  }, [selectedCards, socket]);

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
        } else {
          setSelectedCards((prev) => [...prev, card]);
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
    toast.info(`${game.players.find((user) => user.id === data.user)?.username} failed to set`);

    setUserPoints((prev) => ({ ...prev, [data.user]: data.points }));
  };

  const handleSet = (data: { user: string; set: string[]; laidOut: string[]; points: number }) => {
    removeCards(data.set, data.user);
    setUserPoints((prev) => ({ ...prev, [data.user]: data.points }));
  };

  const handleNewCards = async (data: { laidOut: string[]; newCards: string[]; remaining: number }) => {
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

  useEffect(() => {
    if (!socket) return;

    socket.on("set-error", handleSetError);
    socket.on("set-success", handleSet);
    socket.on("new-cards", handleNewCards);

    return () => {
      socket.off("set-error", handleSetError);
      socket.off("set-success", handleSet);
      socket.off("new-cards", handleNewCards);
    };
  }, [socket, game.laidOut]);

  const newCardsMutation = useMutation(voteForNoSet);

  return (
    <div className="game-wrapper">
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties} ref={cardWrapperRef}>
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
            } ${noneCards.includes(card) && "none"}`}
            onClick={() => {
              if (selectedCards.includes(card)) return setSelectedCards(selectedCards.filter((c) => c !== card));
              if (selectedCards.length === 3) return;
              if (Object.keys(movingCards).length) return;
              setSelectedCards((prev) => [...prev, card]);
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

      <div className="game-players">
        <div className="game-players-list">
          {game.players.map((player) => (
            <PlayerInGame
              key={player.id}
              user={player}
              isHost={player.id === game.host.id}
              isMe={user.id === player.id}
              score={userPoints[player.id] || 0}
              rf={(ref) => {
                playerSlots.current[player.id] = ref;
              }}
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

      <VotePopup remainingCards={remainingCards} />
    </div>
  );
};

export default InProgress;

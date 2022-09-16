import React, { CSSProperties, useEffect, useRef } from "react";
import CardRenderer from "../../../components/card-renderer/CardRenderer";
import { idToCard, wait } from "../../../utils/deck.util";
import { useGame } from "../../../utils/useGame";
import { useUser } from "../../../utils/useUser";
import PlayerInGame from "../components/PlayerInGame";
import "./InProgress.scss";

type MovingCardsType = {
  [id: string]: number;
};

const InProgress = () => {
  const { game, setGame } = useGame();
  const user = useUser();

  const cardWrapperRef = useRef<HTMLDivElement>(null);
  const cardSlots = useRef<{
    [key: string]: HTMLDivElement | null;
  }>({});

  const [selectedCards, setSelectedCards] = React.useState<string[]>([]);
  const [cardsToDisappear, setCardsToDisappear] = React.useState<string[]>([]);
  const [movingCards, setMovingCards] = React.useState<MovingCardsType>({});

  if (!game || !user.isLoggedIn || !game.laidOut) return null;

  const handleCardSelect = async () => {
    const sCards = selectedCards;
    if (!game.laidOut) return;
    sCards.sort((a, b) => game.laidOut!.indexOf(a) - game.laidOut!.indexOf(b));

    await wait(300);
    setCardsToDisappear(selectedCards);
    setSelectedCards([]);
    await wait(300);

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

    // if (!sCards.includes(card1)) movingCardsObj[card1] = freeSlots[0]!;

    // if (!sCards.includes(card1) && game.laidOut.indexOf(sCards[0]) < game.laidOut.length - 3)
    //   movingCardsObj[card1] = game.laidOut.indexOf(sCards[0]);
    // if (!sCards.includes(card2) && game.laidOut.indexOf(sCards[1]) < game.laidOut.length - 3)
    //   movingCardsObj[card2] = game.laidOut.indexOf(sCards[1]);
    // if (!sCards.includes(card3) && game.laidOut.indexOf(sCards[2]) < game.laidOut.length - 3)
    //   movingCardsObj[card3] = game.laidOut.indexOf(sCards[2]);

    setMovingCards(movingCardsObj);

    await wait(1000);
    setGame((game) => {
      if (!game) return null;

      const newLaidOut = game.laidOut;
      if (newLaidOut) {
        newLaidOut.splice(newLaidOut.length - 3, 3);

        for (const card in movingCardsObj) {
          newLaidOut[movingCardsObj[card]] = card;
        }
      }

      return {
        ...game,
        laidOut: newLaidOut ?? null,
      };
    });

    setCardsToDisappear([]);
    setMovingCards({});
  };

  useEffect(() => {
    if (!selectedCards.length) return;

    if (selectedCards.length === 3) handleCardSelect();
  }, [selectedCards]);

  const rowLength = game.laidOut.length / 3;
  const keyMap: { [s: string]: number | null } = {
    "7": 0,
    "8": 1,
    "9": 2,

    "4": rowLength,
    "5": rowLength + 1,
    "6": rowLength + 2,

    "1": rowLength * 2,
    "2": rowLength * 2 + 1,
    "3": rowLength * 2 + 2,

    Home: rowLength > 3 ? 3 : null,
    ArrowUp: rowLength > 4 ? 4 : null,
    PageUp: rowLength > 5 ? 5 : null,

    ArrowLeft: rowLength > 3 ? rowLength + 3 : null,
    Clear: rowLength > 4 ? rowLength + 4 : null,
    ArrowRight: rowLength > 5 ? rowLength + 5 : null,

    End: rowLength > 3 ? rowLength * 2 + 3 : null,
    ArrowDown: rowLength > 4 ? rowLength * 2 + 4 : null,
    PageDown: rowLength > 5 ? rowLength * 2 + 5 : null,
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // if keypad 1-9 is pressed
      // if (e.key >= "1" && e.key <= "9") {
      if (e.key in keyMap) {
        if (!game.laidOut) return;
        const index = keyMap[e.key];
        if (index === null) return;
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

  return (
    <div className="game-wrapper">
      <div className="game-cards" style={{ "--columns": (game.laidOut?.length || 0) / 3 } as CSSProperties} ref={cardWrapperRef}>
        {game.laidOut?.map((_, i) => {
          if (!game.laidOut) return null;
          const rowLength = game.laidOut.length / 3;

          const column = i % rowLength;
          const row = Math.floor(i / rowLength);
          const id = column * 3 + row;

          return (
            <div className="card-slot" ref={(ref) => (cardSlots.current[id] = ref)} key={i}>
              {id}
            </div>
            // <div
            //   className={`game-card-wrapper ${selectedCards.includes(card) && "active"}`}
            //   onClick={() => {
            //     if (selectedCards.includes(card)) return setSelectedCards(selectedCards.filter((c) => c !== card));
            //     if (selectedCards.length === 3) return;

            //     setSelectedCards((prev) => [...prev, card]);
            //   }}
            // >
            //   <CardRenderer key={i} props={idToCard(card)} />
            // </div>
          );
        })}
      </div>

      <div className="game-cards-elements">
        {game.laidOut?.map((card, i) => (
          <div
            className={`game-card-wrapper ${selectedCards.includes(card) && "active"} ${
              cardsToDisappear.includes(card) && "disappear"
            }`}
            onClick={() => {
              if (selectedCards.includes(card)) return setSelectedCards(selectedCards.filter((c) => c !== card));
              if (selectedCards.length === 3) return;
              setSelectedCards((prev) => [...prev, card]);
            }}
            style={
              {
                "--x": cardSlots.current[movingCards[card] ?? i]?.offsetLeft,
                "--y": cardSlots.current[movingCards[card] ?? i]?.offsetTop,
              } as CSSProperties
            }
          >
            <CardRenderer key={i} props={idToCard(card)} />
          </div>
        ))}
      </div>

      <div className="game-players">
        {game.players.map((player) => (
          <PlayerInGame
            key={player.id}
            user={player}
            isHost={player.id === game.host.id}
            isMe={user.id === player.id}
            score={0}
          />
        ))}
      </div>
    </div>
  );
};

export default InProgress;

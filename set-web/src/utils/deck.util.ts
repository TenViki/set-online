import { CardProps } from "../types/CardType";

export const createDeck = (): CardProps[] => {
  const deck: CardProps[] = [];
  for (let i = 1; i < 4; i++) {
    for (let j = 1; j < 4; j++) {
      for (let k = 1; k < 4; k++) {
        for (let l = 1; l < 4; l++) {
          deck.push({
            color: i,
            shape: j,
            fill: k,
            count: l,
          });
        }
      }
    }
  }
  return deck;
};

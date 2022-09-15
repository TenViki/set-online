export interface Card {
  count: number;
  shape: number;
  color: number;
  fill: number;
}

const getCardId = (card: Card) => {
  return `${card.count}${"rpg"[card.color - 1]}${"fhe"[card.fill - 1]}${"orw"[card.shape - 1]}`;
};

export const generateDeck = () => {
  const deck: string[] = [];

  for (let i = 1; i <= 3; i++) {
    for (let j = 1; j <= 3; j++) {
      for (let k = 1; k <= 3; k++) {
        for (let l = 1; l <= 3; l++) {
          deck.push(
            getCardId({
              count: i,
              shape: j,
              color: k,
              fill: l,
            }),
          );
        }
      }
    }
  }

  return deck;
};

export const shuffleDeck = (deck: string[]) => {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
};

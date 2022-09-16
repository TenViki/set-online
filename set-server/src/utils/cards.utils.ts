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

const allSame = (c1: string, c2: string, c3: string) => {
  return c1 === c2 && c2 === c3;
};

const allDifferent = (c1: string, c2: string, c3: string) => {
  return c1 !== c2 && c2 !== c3 && c1 !== c3;
};

export const isSet = (cards: string[]) => {
  // check if all cards are set based of id
  const [c1, c2, c3] = cards;

  if (!(allSame(c1[0], c2[0], c3[0]) || allDifferent(c1[0], c2[0], c3[0]))) return false;
  if (!(allSame(c1[1], c2[1], c3[1]) || allDifferent(c1[1], c2[1], c3[1]))) return false;
  if (!(allSame(c1[2], c2[2], c3[2]) || allDifferent(c1[2], c2[2], c3[2]))) return false;
  if (!(allSame(c1[3], c2[3], c3[3]) || allDifferent(c1[3], c2[3], c3[3]))) return false;

  return true;
};

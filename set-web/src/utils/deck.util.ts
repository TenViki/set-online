import { CardProps } from "../types/CardType";

export const genrateRandomSet = (): CardProps[] => {
  const card1 = generateRandomCard();
  const card2 = generateRandomCard();

  const card3: CardProps = {
    color: getThirdValue(card1.color, card2.color),
    count: getThirdValue(card1.count, card2.count),
    shape: getThirdValue(card1.shape, card2.shape),
    fill: getThirdValue(card1.fill, card2.fill),
  };

  return [card1, card2, card3];
};

const generateRandomCard = (): CardProps => {
  return {
    color: Math.floor(Math.random() * 3) + 1,
    count: Math.floor(Math.random() * 3) + 1,
    shape: Math.floor(Math.random() * 3) + 1,
    fill: Math.floor(Math.random() * 3) + 1,
  };
};

const getThirdValue = (a: number, b: number) => {
  if (a === b) {
    return a;
  }

  return 6 - a - b;
};

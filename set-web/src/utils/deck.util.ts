import { CardProps } from "../types/CardType";
import { UserLowType } from "../types/Game.type";

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

export const idToCard = (id: string): CardProps => {
  return {
    count: Number(id[0]),
    color: "rpg".indexOf(id[1]) + 1,
    fill: "fhe".indexOf(id[2]) + 1,
    shape: "orw".indexOf(id[3]) + 1,
  };
};

export const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const transformPoints = (points: { user: UserLowType; points: number }[]): { [key: string]: number } => {
  const newPoints: { [key: string]: number } = {};
  points.forEach((point) => {
    newPoints[point.user.id] = point.points;
  });
  return newPoints;
};

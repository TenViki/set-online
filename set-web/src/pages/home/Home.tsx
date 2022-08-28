import React from "react";
import Button from "../../components/button/Button";
import CardRenderer from "../../components/card-renderer/CardRenderer";
import Page from "../../components/page/Page";
import { CardProps } from "../../types/CardType";
import { genrateRandomSet } from "../../utils/deck.util";
import HeroStat from "./components/HeroStat";
import "./Home.scss";
import { FiChevronRight } from "react-icons/fi";
import { IoGameControllerOutline } from "react-icons/io5";

const Home = () => {
  const [cards, setCards] = React.useState<CardProps[]>(genrateRandomSet());

  return (
    <Page>
      <div className="home-hero">
        <div className="home-hero-cards">
          {cards.map((card, index) => (
            <CardRenderer key={index} props={card} size="large" />
          ))}
        </div>
        <div className="home-hero-text">
          <h1>
            Play SET! Online <br />
            on the #1 Site!
          </h1>

          <div className="home-hero-stats">
            <HeroStat title="Games today" value="1 000 000" />
            <HeroStat title="Players online" value="100 000" />
          </div>

          <div className="home-hero-buttons">
            <Button text={"Log in"} color="gray" />
            <Button
              leftIcon={IoGameControllerOutline}
              rightIcon={FiChevronRight}
              text={"Play online!"}
              color="success"
            />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default Home;

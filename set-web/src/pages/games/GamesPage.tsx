import React from "react";
import Button from "../../components/button/Button";
import Page from "../../components/page/Page";
import JoinGame from "./components/JoinGame";
import NewGame from "./components/NewGame";
import "./GamesPage.scss";

const GamesPage = () => {
  return (
    <Page>
      <div className="games-page">
        <JoinGame />
        <NewGame />
      </div>
    </Page>
  );
};

export default GamesPage;

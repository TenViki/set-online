import React from "react";
import { Routes, Route } from "react-router";
import DiscordRedirect from "./pages/auth/DiscordRedirect";
import GoogleRedirect from "./pages/auth/GoogleRedirect";
import Game from "./pages/game/Game";
import GamesPage from "./pages/games/GamesPage";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";
import Recovery from "./pages/recovery/Recovery";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login defaultState={1} />} />
      <Route path="/signup" element={<Login defaultState={2} />} />
      <Route path="/recover-account" element={<Login defaultState={0} />} />
      <Route path="/recovery" element={<Recovery />} />

      <Route path="/play" element={<GamesPage />} />
      <Route path="/games/:id" element={<Game />} />

      <Route path="/profile/*" element={<Profile />} />

      <Route path="/auth/redirect/discord" element={<DiscordRedirect />} />
      <Route path="/auth/redirect/google" element={<GoogleRedirect />} />
    </Routes>
  );
};

export default Router;

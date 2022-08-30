import React from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import Profile from "./pages/profile/Profile";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login defaultState={1} />} />
      <Route path="/signup" element={<Login defaultState={2} />} />
      <Route path="/recover-account" element={<Login defaultState={0} />} />

      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
};

export default Router;

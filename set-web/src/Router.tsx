import React from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login defaultState={1} />} />
    </Routes>
  );
};

export default Router;

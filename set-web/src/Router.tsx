import React from "react";
import { Routes, Route } from "react-router";
import Home from "./pages/home/Home";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<>lel</>} />
    </Routes>
  );
};

export default Router;

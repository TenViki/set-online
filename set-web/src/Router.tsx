import React from "react";
import { Routes, Route } from "react-router";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<>henlo</>} />
      <Route path="/lel" element={<>lel</>} />
    </Routes>
  );
};

export default Router;

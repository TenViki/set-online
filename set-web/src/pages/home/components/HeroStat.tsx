import React, { FC } from "react";
import "./HeroStat.scss";

interface HeroStatProps {
  title: string;
  value: string;
}

const HeroStat: FC<HeroStatProps> = ({ title, value }) => {
  return (
    <div className="home-hero-stat">
      <div className="home-hero-stat-value">{value}</div>
      <div className="home-hero-stat-label">{title}</div>
    </div>
  );
};

export default HeroStat;

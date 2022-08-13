import React from "react";
import { CardProps } from "../../types/CardType";
import "./CardRenderer.scss";

interface CardRendererProps {
  props: CardProps;
}

const CardRenderer: React.FC<CardRendererProps> = ({ props }) => {
  return (
    <div className="card">
      Color: {props.color}
      <br />
      Shape: {props.shape}
      <br />
      Count: {props.count}
      <br />
      Fill: {props.fill}
    </div>
  );
};

export default CardRenderer;

import React from "react";
import { CardProps } from "../../types/CardType";
import "./CardRenderer.scss";
import {
  OvalDashed,
  OvalEmpty,
  RhombusDashed,
  RhombusEmpty,
  WaveDashed,
  WaveEmpty,
} from "../../assets/shapes/Shapes";

interface CardRendererProps {
  props: CardProps;
}

const CardRenderer: React.FC<CardRendererProps> = ({ props }) => {
  let SelectedShape: any;

  switch (props.shape) {
    case 1:
      SelectedShape = props.fill == 2 ? OvalDashed : OvalEmpty;
      break;
    case 2:
      SelectedShape = props.fill == 2 ? WaveDashed : WaveEmpty;
      break;
    case 3:
      SelectedShape = props.fill == 2 ? RhombusDashed : RhombusEmpty;
      break;
  }

  if (!SelectedShape) return <div className="card"></div>;

  return (
    <div className={`card color-${props.color} fill-${props.fill}`}>
      {[...Array(props.count)].map(() => (
        <SelectedShape />
      ))}
    </div>
  );
};

export default CardRenderer;

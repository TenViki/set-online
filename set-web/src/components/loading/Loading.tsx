import React, { CSSProperties, FC } from "react";
import "./Loading.scss";
import { ColorType } from "../../types/color";

interface LoadingProps {
  colorA?: ColorType | string;
  colorB?: ColorType | string;
  colorC?: ColorType | string;
  colorD?: ColorType | string;
  size?: number;
}

const Loading: FC<LoadingProps> = ({ colorA, colorB, colorC, colorD, size }) => {
  return (
    <div
      className="loading-spinner"
      style={
        {
          "--color-a": colorA ? (colorA.startsWith("#") ? colorA : `var(--${colorA})`) : "var(--main)",
          "--color-b": colorB ? (colorB.startsWith("#") ? colorB : `var(--${colorB})`) : "var(--danger)",
          "--color-c": colorC ? (colorC.startsWith("#") ? colorC : `var(--${colorC})`) : "var(--success)",
          "--color-d": colorD ? (colorD.startsWith("#") ? colorD : `var(--${colorD})`) : "var(--card-color-2)",
          "--size": size ? size : 1.5,
        } as CSSProperties
      }
    >
      <span className="loading-spinner-a" />
      <span className="loading-spinner-b" />
      <span className="loading-spinner-c" />
      <span className="loading-spinner-d" />
    </div>
  );
};

export default Loading;

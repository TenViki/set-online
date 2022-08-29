import React from "react";
import { ColorType } from "../../types/color";
import "./Checkbox.scss";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  color?: ColorType;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, color }) => {
  return (
    <button
      type="button"
      className={`checkbox ${checked ? "active" : ""} ${color ? color : "main"}`}
      onClick={() => onChange(!checked)}
    >
      <div className={`checkbox-squere`}>
        <span className="stick a" />
        <span className="stick b" />
        <span className="checkbox-overlay" />
      </div>
      {label && <div className="checkbox-label">{label}</div>}
    </button>
  );
};

export default Checkbox;

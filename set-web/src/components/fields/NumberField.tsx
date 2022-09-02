import React, { FC } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import Button from "../button/Button";
import "./NumberField.scss";

interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  error?: string;
  step?: number;
  min?: number;
  max?: number;
}

const NumberField: FC<NumberFieldProps> = ({ max, min, onChange, step, value, error }) => {
  const [textValue, setTextValue] = React.useState(value.toString());

  const handleOnChange = (newValString: string) => {
    const newVal = +newValString;
    if (isNaN(newVal) || !newValString) return setTextValue(value.toString());
    handleValueChange(newVal);
  };

  const handleValueChange = (newVal: number) => {
    if (max && newVal > max) {
      onChange(max);
      setTextValue(max.toString());
    } else if (min && newVal < min) {
      onChange(min);
      setTextValue(min.toString());
    } else {
      onChange(newVal);
      setTextValue(newVal.toString());
    }
  };

  const handleInputChange = (str: string) => {
    const number = +str;
    if (isNaN(number)) return setTextValue(value.toString());

    if (max && number > max) {
      setTextValue(max.toString());
    } else setTextValue(str);
  };

  return (
    <div className="numberfield-wrapper">
      <div className="numberfield">
        <Button
          variant="text"
          leftIcon={FiMinus}
          onClick={() => handleValueChange(value - (step || 1))}
          disabled={!!(min && value <= min)}
        />
        <input
          type="number"
          value={textValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onBlur={(e) => handleOnChange(e.target.value)}
        />
        <Button
          variant="text"
          leftIcon={FiPlus}
          onClick={() => handleValueChange(value + (step || 1))}
          disabled={!!(max && value >= max)}
        />
      </div>

      {error && <div className="textfield-error">{error}</div>}
    </div>
  );
};

export default NumberField;

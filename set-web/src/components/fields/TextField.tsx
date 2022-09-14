import React, { FC } from "react";
import { IconType } from "react-icons";
import { ColorType } from "../../types/color";
import "./TextField.scss";

interface TextFieldProps {
  icon: IconType;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (text: string) => void;
  error?: string;
  color: ColorType;
  disableAutofill?: boolean;
}

const TextField: FC<TextFieldProps> = ({ icon: Icon, placeholder, type, value, onChange, error, color, disableAutofill }) => {
  const [focused, setFocused] = React.useState(false);

  return (
    <div className="textfield-wrapper">
      <div className={`textfield ${error ? "error" : ""} ${color ? color : "main"} ${focused ? "focused" : ""}`}>
        {Icon && (
          <div className="textfield-icon">
            <Icon />
          </div>
        )}

        <input
          value={value}
          type={type ? type : "text"}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoComplete={disableAutofill ? "off" : "on"}
        />
      </div>

      {error && <div className="textfield-error">{error}</div>}
    </div>
  );
};

export default TextField;

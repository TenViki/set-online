import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import "./Login.scss";

interface LoginProps {
  defaultState: 0 | 1 | 2;
}

const Login: FC<LoginProps> = ({ defaultState }) => {
  const [state, setState] = useState(defaultState);
  const [selectState, setSelectState] = useState({
    width: 0,
    left: 0,
  });

  const loginLabel = useRef<HTMLDivElement>(null);
  const signupLabel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state === 1)
      setSelectState({
        width: loginLabel.current?.offsetWidth || 0,
        left: loginLabel.current?.offsetLeft || 0,
      });
    else if (state === 2)
      setSelectState({
        width: signupLabel.current?.offsetWidth || 0,
        left: signupLabel.current?.offsetLeft || 0,
      });
  }, [state]);

  return (
    <div className="login-page">
      <div className="login-select">
        <div
          className={`login-select-option text ${state === 1 ? "active" : ""} login text`}
          ref={loginLabel}
          onClick={() => setState(1)}
        >
          Log in
        </div>
        <div
          className={`login-select-option text ${state === 2 ? "active" : ""} signup text`}
          ref={signupLabel}
          onClick={() => setState(2)}
        >
          Sign up
        </div>
        <span
          className={`login-select-slider state-${state}`}
          style={{ "--width": selectState.width, "--offset": selectState.left } as CSSProperties}
        />
      </div>

      <div className="login-slider">heh</div>
    </div>
  );
};

export default Login;

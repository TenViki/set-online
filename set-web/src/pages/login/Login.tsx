import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import "./Login.scss";
import "./components/Form.scss";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ResetForm from "./components/ResetForm";
import LoginButton from "./components/LoginButton";

import google from "../../assets/logos/google.svg";
import discord from "../../assets/logos/discord.svg";

interface LoginProps {
  defaultState: 0 | 1 | 2;
}

const Login: FC<LoginProps> = ({ defaultState }) => {
  const [state, setState] = useState(defaultState);
  const [selectState, setSelectState] = useState<{
    width: number | null;
    left: number | null;
  }>({
    width: null,
    left: null,
  });

  const loginLabel = useRef<HTMLDivElement>(null);
  const signupLabel = useRef<HTMLDivElement>(null);

  const forms = useRef<(HTMLDivElement | null)[]>([]);

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

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    setWrapperHeight(forms.current[state]?.offsetHeight);
  }, [state, forms, error]);

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

      <div className="login-slider" style={{ "--offset": state, "--height": wrapperHeight } as CSSProperties}>
        <div className={`login-item ${state === 0 ? "active" : ""}`} ref={(ref) => (forms.current[0] = ref)}>
          <ResetForm email={email} setEmail={setEmail} error={error} />
        </div>
        <div className={`login-item ${state === 1 ? "active" : ""}`} ref={(ref) => (forms.current[1] = ref)}>
          <LoginForm
            password={password}
            setPassword={setPassword}
            setUsername={setUsername}
            username={username}
            error={error}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            setState={setState}
          />
        </div>
        <div className={`login-item ${state === 2 ? "active" : ""}`} ref={(ref) => (forms.current[2] = ref)}>
          <SignupForm
            email={email}
            password={password}
            rememberMe={rememberMe}
            setEmail={setEmail}
            setPassword={setPassword}
            setUsername={setUsername}
            setRememberMe={setRememberMe}
            username={username}
            error={error}
          />
        </div>
      </div>

      <div className="login-alternatives">
        <div className="login-separator text">OR</div>
        <div className="login-buttons">
          <LoginButton image={google} color="#34A853" onClick={() => {}} text={"Login with Google"} />
          <LoginButton image={discord} color="#5865F2" onClick={() => {}} text={"Login with Discord"} />
        </div>
      </div>
    </div>
  );
};

export default Login;

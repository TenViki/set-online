import { CSSProperties, FC, useEffect, useRef, useState } from "react";
import "./Login.scss";
import "./components/Form.scss";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ResetForm from "./components/ResetForm";

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

  const [wrapperHeight, setWrapperHeight] = useState(0);

  useEffect(() => {
    setWrapperHeight(forms.current[state]?.offsetHeight || 0);
  }, [state, forms]);

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

      <div className="login-slider" style={{ "--offset": state } as CSSProperties}>
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

      <div className="login-alternatives">OR {wrapperHeight}</div>

      <div onClick={() => setState(0)}>Forgot?</div>
      <div onClick={() => setError("Username nein lmao")}>Trigger error</div>
    </div>
  );
};

export default Login;

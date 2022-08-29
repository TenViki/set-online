import { CSSProperties, FC, FormEvent, useEffect, useRef, useState } from "react";
import "./components/Form.scss";
import LoginButton from "./components/LoginButton";
import LoginForm from "./components/LoginForm";
import ResetForm from "./components/ResetForm";
import SignupForm from "./components/SignupForm";
import "./Login.scss";

import { useMutation } from "react-query";
import { AuthResponse, loginRequest } from "../../api/auth";
import discord from "../../assets/logos/discord.svg";
import google from "../../assets/logos/google.svg";
import { ApiError } from "../../types/Api.type";
import { toast } from "react-toastify";

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
    window.addEventListener("resize", updateSelectState);
    console.log("Adding resize event listener");

    return () => {
      console.log("Removing resize event listener");
      window.removeEventListener("resize", updateSelectState);
    };
  }, []);

  const updateSelectState = () => {
    console.log("Resize");
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
  };

  useEffect(updateSelectState, [state]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [wrapperHeight, setWrapperHeight] = useState<number | undefined>(undefined);

  const loginMutation = useMutation(loginRequest, {
    onError: (error: ApiError) => {
      if (error.response?.data?.error.message) setError(error.response.data.error.message);
      else toast.error("Something wennt wrong");
    },
    onSuccess: (data: AuthResponse) => {
      console.log(data);
      toast.success("Successfully logged in");
    },
  });

  useEffect(() => {
    setWrapperHeight(forms.current[state]?.offsetHeight);
  }, [state, forms, error]);

  const handlePasswordLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!username || !password) return toast.error("Please fill in all fields");
    loginMutation.mutate({ loginType: "PASSWORD", username, password, rememberMe });
  };

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
            onSubmit={handlePasswordLogin}
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
          <LoginButton
            image={google}
            color="linear-gradient(110deg, #EA4335 0% 24.5%, #4285F4 25% 50%, #34A853 50.5% 75%, #FBBC05 75.5% 100%)"
            onClick={() => {}}
            text={"Login with Google"}
          />
          <LoginButton image={discord} color="#5865F2" onClick={() => {}} text={"Login with Discord"} />
        </div>
      </div>
    </div>
  );
};

export default Login;

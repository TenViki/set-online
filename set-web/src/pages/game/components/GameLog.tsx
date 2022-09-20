import React, { useEffect } from "react";
import reactStringReplace from "react-string-replace";
import "./GameLog.scss";

interface GameLogProps {
  log: {
    type: "info" | "error";
    message: string;
  }[];
}

export const useGameLog = () => {
  const [log, setLog] = React.useState<
    {
      type: "info" | "error";
      message: string;
    }[]
  >([]);

  const addLog = (message: string, type?: "info" | "error") => {
    setLog((prev) => [
      ...prev,
      {
        type: type || "info",
        message,
      },
    ]);
  };

  return {
    log,
    addLog,
  };
};

const GameLog: React.FC<GameLogProps> = ({ log }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth",
    });
  }, [log]);

  const scrollable = ref.current && ref.current.scrollHeight > ref.current.clientHeight;

  return (
    <div className={`game-log ${scrollable ? "scrollable" : ""}`} ref={ref}>
      {log.map((log, index) => {
        let replacedText = reactStringReplace(log.message, /(\*\*.*\*\*)/g, (match, i) => (
          <span key={match + i} className="bold">
            {match.replaceAll("**", "")}
          </span>
        ));

        replacedText = reactStringReplace(replacedText, /(\*.*\*)/g, (match, i) => (
          <span key={match + i} className="italic">
            {match.replaceAll("*", "")}
          </span>
        ));

        return (
          <div key={index} className={`game-log-item ${log.type}`}>
            {replacedText}
          </div>
        );
      })}
    </div>
  );
};

export default GameLog;

import { useEffect, useState } from "react";
import { useGame } from "./useGame";

export const usePing = () => {
  const game = useGame();
  const [ping, setPing] = useState({
    ping: 0,
  });

  const handlePing = () => {
    game.socket?.emit("ping", {
      timestamp: Date.now(),
    });
  };

  useEffect(() => {
    if (!game.socket) return;

    const interval = setInterval(handlePing, 3000);
    game.socket.on("pong", (data: { timestamp: number; serverTimestamp: number }) => {
      setPing((oldPing) => {
        return {
          ping: Date.now() - data.timestamp,
        };
      });
    });

    return () => {
      clearInterval(interval);
    };
  }, [game.socket]);

  return ping;
};

import { RefObject } from "react";
import { playerInterface, playerStatsType } from "../../../types/playersTypes";

export function generatePlayers(canvasRef: RefObject<HTMLCanvasElement>):
  | {
      player: playerInterface;
      bot: playerInterface;
    }
  | { player: undefined; bot: undefined } {
  if (canvasRef.current !== null) {
    const playerStats: playerStatsType = {
      size: 25,
      color: "red",
      strikeInterval: 1000,
    };

    const defaultX: number = 125;
    const defaultY: number = 75;

    const player: playerInterface = {
      player: "player",
      x: defaultX,
      y: defaultY,
      speed: 1,
      ...playerStats,
      bulletStats: {
        source: "player",
        x: defaultX,
        y: defaultY,
        size: 12,
        speed: 1.5,
        bulletColor: "#1965e0",
      },
      bullets: [],
      lastFire: 0,
    };

    const bot: playerInterface = {
      player: "bot",
      x: canvasRef.current!.width - defaultX,
      y: canvasRef.current!.height - defaultY,
      speed: -1,
      ...playerStats,
      bulletStats: {
        source: "bot",
        x: canvasRef.current!.width - defaultX,
        y: canvasRef.current!.height - defaultY,
        size: 12,
        speed: -1.5,
        bulletColor: "#1965e0",
      },
      bullets: [],
      lastFire: 0,
    };

    return { player, bot };
  }
  return { player: undefined, bot: undefined };
}

import { MouseEvent, useEffect, useRef } from "react";
import { playerInterface, playerParamsType } from "../../types/gameTypes";
import { generatePlayers } from "./function/generatePlayers";

const canvasStyles = { border: "1px solid #b8b4b4" };

let mousePosition: { x: number; y: number } = {
  x: 0,
  y: 0,
};

let playerConfig: playerInterface | null = null;
let botConfig: playerInterface | null = null;

interface GameProps {
  setScore: Function;
  setPlayerConfig: Function;
  setBotConfig: Function;
  openBotColorSelection: Function;
  openPlayerColorSelection: Function;
  playerParams: playerParamsType;
  botParams: playerParamsType;
}

export const Game = ({
  setScore,
  setPlayerConfig,
  setBotConfig,
  openBotColorSelection,
  openPlayerColorSelection,
  playerParams,
  botParams,
}: GameProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (playerConfig) {
      playerConfig.speed =
        playerConfig.speed < 0
          ? -playerParams.playerSpeed
          : playerParams.playerSpeed;
      playerConfig.strikeInterval = playerParams.strikeInterval;
      playerConfig.bulletStats.bulletColor = playerParams.bulletColor;
    }
  }, [playerParams]);

  useEffect(() => {
    if (botConfig) {
      botConfig.speed =
        botConfig.speed < 0 ? -botParams.playerSpeed : botParams.playerSpeed;
      botConfig.strikeInterval = botParams.strikeInterval;
      botConfig.bulletStats.bulletColor = botParams.bulletColor;
    }
  }, [botParams]);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const { player, bot } = generatePlayers(canvasRef, setScore);

      if (player !== undefined) {
        playerConfig = player;
        setPlayerConfig({
          playerSpeed: player.speed,
          strikeInterval: player.strikeInterval,
          bulletColor: player.bulletStats.bulletColor,
        });
        botConfig = bot;
        setBotConfig({
          playerSpeed: -bot.speed,
          strikeInterval: bot.strikeInterval,
          bulletColor: bot.bulletStats.bulletColor,
        });
      }
      main();
    }
  }, [canvasRef]);

  function update() {
    if (playerConfig && botConfig) {
      const ctx = canvasRef.current!.getContext("2d");

      if (ctx !== null) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
      }

      playerConfig.y += playerConfig.speed;
      botConfig.y += botConfig.speed;

      playerConfig.checkColission(mousePosition);
      botConfig.checkColission(mousePosition);
    }
  }

  function render(config: playerInterface) {
    const ctx = canvasRef.current!.getContext("2d");

    if (ctx !== null) {
      ctx.beginPath();
      ctx.arc(config.x, config.y, config.size, 0, 2 * Math.PI, false);
      ctx.fillStyle = config.color;
      ctx.fill();
    }
  }

  function main() {
    if (playerConfig && botConfig) {
      update();
      render(playerConfig);
      render(botConfig);

      botConfig.strike();
      playerConfig.strike();

      requestAnimationFrame(main);
    }
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function mouseMoveHandle(event: MouseEvent) {
    clearTimeout(timeoutRef.current || 0);
    if (playerConfig && botConfig) {
      const canvasPos = canvasRef.current!.getBoundingClientRect();
      const { clientX: mouseX, clientY: mouseY } = event;

      const inMousePlayer =
        mouseY - canvasPos.y > playerConfig.y - 25 &&
        mouseY - canvasPos.y < playerConfig.y + 25;
      const inMouseBot =
        mouseY - canvasPos.y > botConfig.y - 25 &&
        mouseY - canvasPos.y < botConfig.y + 25;

      timeoutRef.current = setTimeout(() => {
        if (!inMousePlayer && !inMouseBot) {
          mousePosition = { x: mouseX - canvasPos.x, y: mouseY - canvasPos.y };
        }
      }, 5);
    }
  }
  function mouseClickHandle(event: MouseEvent) {
    if (playerConfig!.click(event)) {
      openPlayerColorSelection();
    }
    if (botConfig!.click(event)) {
      openBotColorSelection();
    }
  }
  return (
    <canvas
      onMouseMove={mouseMoveHandle}
      onClick={mouseClickHandle}
      width={1024}
      height={640}
      style={canvasStyles}
      ref={canvasRef}
    ></canvas>
  );
};

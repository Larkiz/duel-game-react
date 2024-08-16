import { MouseEvent, useEffect, useRef, useState } from "react";
import { bulletInterface, playerInterface } from "../types/playersTypes";
import { generatePlayers } from "./game/function/generatePlayers";
import { Controls } from "./controls/Controls";

const canvasStyles = { border: "1px solid #b8b4b4" };

let mousePosition: { x: number; y: number } = {
  x: 0,
  y: 0,
};

const defaultConfig: playerInterface = {
  player: "default",
  x: 0,
  y: 0,
  size: 0,
  speed: 1,
  color: "red",
  strikeInterval: 1000,
  bulletStats: {
    source: "default",
    x: 0,
    y: 0,
    size: 0,
    speed: 0,
    bulletColor: "#1965e0",
  },
  bullets: [],
  lastFire: 0,
};

let playerConfig: playerInterface = { ...defaultConfig };
let botConfig: playerInterface = { ...defaultConfig, speed: -1 };

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayerConfig] = useState<playerInterface>(defaultConfig);
  const [bot, setBotConfig] = useState<playerInterface>(defaultConfig);

  useEffect(() => {
    if (canvasRef.current !== null) {
      const { player, bot } = generatePlayers(canvasRef);

      if (player !== undefined) {
        playerConfig = player;
        setPlayerConfig(player);
        botConfig = bot;
        setBotConfig(bot);
      }
      main();
    }
  }, [canvasRef]);

  const [score, setScore] = useState<{ player: number; bot: number }>({
    player: 0,
    bot: 0,
  });

  function strike(config: playerInterface) {
    const nowTime = Date.now();
    if (nowTime - config.lastFire > config.strikeInterval) {
      config.bullets.push({
        ...config.bulletStats,
        y: config.y,
      });
      config.lastFire = Date.now();
    }

    const ctx = canvasRef.current!.getContext("2d");
    if (ctx !== null) {
      for (let index = 0; index < config.bullets.length; index++) {
        const bullet = config.bullets[index];

        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.size, 0, 2 * Math.PI, false);
        ctx.fillStyle = bullet.bulletColor;
        ctx.fill();

        bullet.x += bullet.speed;
        bulletColission(bullet, config, index);
      }
    }
  }

  function bulletColission(
    bullet: bulletInterface,
    config: playerInterface,
    index: number
  ) {
    const player = config.player;

    if (bullet.x >= canvasRef.current!.width || bullet.x <= 0) {
      config.bullets.splice(index, 1);
    }
    if (
      player === "player" &&
      botConfig.x - botConfig.size <= bullet.x + bullet.size &&
      botConfig.x + botConfig.size >= bullet.x - bullet.size &&
      botConfig.y + botConfig.size >= bullet.y - bullet.size &&
      botConfig.y - botConfig.size <= bullet.y + bullet.size
    ) {
      config.bullets.splice(index, 1);
      setScore((prev) => {
        return { ...prev, player: prev.player + 1 };
      });
    }
    if (
      player === "bot" &&
      playerConfig.x - playerConfig.size <= bullet.x + bullet.size &&
      playerConfig.x + playerConfig.size >= bullet.x - bullet.size &&
      playerConfig.y + playerConfig.size >= bullet.y - bullet.size &&
      playerConfig.y - playerConfig.size <= bullet.y + bullet.size
    ) {
      config.bullets.splice(index, 1);
      setScore((prev) => {
        return { ...prev, bot: prev.bot + 1 };
      });
    }
  }

  function checkCollision(config: playerInterface): void {
    if (config) {
      const mouseYCond =
        (mousePosition.y - config.size <= config.y &&
          config.speed < 0 &&
          mousePosition.y - (config.y - config.size) >= 0) ||
        (mousePosition.y + config.size >= config.y &&
          config.speed > 0 &&
          mousePosition.y - (config.size + config.y) <= 0);

      const mouseXCond =
        mousePosition.x + config.size >= config.x &&
        mousePosition.x - config.size <= config.x;
      const bordersCond =
        canvasRef.current!.height <= config.y + config.size ||
        0 >= config.y - config.size;

      if (
        bordersCond ||
        (mouseYCond && mouseXCond && config.player !== "bot")
      ) {
        config.speed *= -1;
      }
    }
  }

  function update() {
    const ctx = canvasRef.current!.getContext("2d");

    if (ctx !== null) {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }

    playerConfig.y += playerConfig.speed;
    botConfig.y += botConfig.speed;
    checkCollision(botConfig);
    checkCollision(playerConfig);
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
    update();
    render(playerConfig);
    render(botConfig);

    strike(botConfig);
    strike(playerConfig);

    requestAnimationFrame(main);
  }

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function mouseMoveHandle(event: MouseEvent) {
    const canvasPos = canvasRef.current!.getBoundingClientRect();
    const { clientX: mouseX, clientY: mouseY } = event;
    const inMouse =
      mouseY - canvasPos.y > playerConfig.y - 25 &&
      mouseY - canvasPos.y < playerConfig.y + 25;
    clearTimeout(timeoutRef.current || 0);
    timeoutRef.current = setTimeout(() => {
      if (!inMouse) {
        mousePosition = { x: mouseX - canvasPos.x, y: mouseY - canvasPos.y };
      }
    }, 5);
  }
  const [colorSelectionOpen, setColorSelection] = useState<{
    bot: boolean;
    player: boolean;
  }>({ bot: false, player: false });

  function mouseClickHandle(event: MouseEvent) {
    const { clientX: mouseX, clientY: mouseY } = event;
    const canvasPos = canvasRef.current!.getBoundingClientRect();
    const mouseXCondPlayer =
      mouseX - canvasPos.x + playerConfig.size >= playerConfig.x &&
      mouseX - canvasPos.x - playerConfig.size <= playerConfig.x;
    const mouseXCondBot =
      mouseX - canvasPos.x + botConfig.size >= botConfig.x &&
      mouseX - canvasPos.x - botConfig.size <= botConfig.x;
    if (
      mouseY - canvasPos.y >= playerConfig.y - 25 &&
      mouseY - canvasPos.y <= playerConfig.y + 25 &&
      mouseXCondPlayer
    ) {
      setColorSelection({
        ...colorSelectionOpen,
        player: !colorSelectionOpen.player,
      });
    }
    if (
      mouseY - canvasPos.y >= botConfig.y - 25 &&
      mouseY - canvasPos.y <= botConfig.y + 25 &&
      mouseXCondBot
    ) {
      setColorSelection({
        ...colorSelectionOpen,
        bot: !colorSelectionOpen.bot,
      });
    }
  }

  return (
    <div>
      <Controls
        colorSelectionOpen={colorSelectionOpen.player}
        config={player}
      />

      <canvas
        onMouseMove={mouseMoveHandle}
        onClick={mouseClickHandle}
        width={1024}
        height={640}
        style={canvasStyles}
        ref={canvasRef}
      ></canvas>
      <div>
        {score.player} : {score.bot}
      </div>
      <Controls colorSelectionOpen={colorSelectionOpen.bot} config={bot} />
    </div>
  );
}

export default App;

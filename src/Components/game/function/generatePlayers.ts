import { RefObject } from "react";
import {
  playerInterface,
  playerStatsType,
  bulletInterface,
  mousePosType,
  scoreType,
} from "../../../types/gameTypes";

import { MouseEvent } from "react";

export function generatePlayers(
  canvasRef: RefObject<HTMLCanvasElement>,
  setScore: Function
):
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
      speed: 2,
      ...playerStats,
      bulletStats: {
        source: "player",
        x: defaultX,
        y: defaultY,
        size: 12,
        speed: 3,
        bulletColor: "#1965e0",
      },
      bullets: [],
      lastFire: 0,
      checkColission(mousePos: mousePosType) {
        const mouseYCond =
          (mousePos.y - this.size <= this.y &&
            this.speed < 0 &&
            mousePos.y - (this.y - this.size) >= 0) ||
          (mousePos.y + this.size >= this.y &&
            this.speed > 0 &&
            mousePos.y - (this.size + this.y) <= 0);

        const mouseXCond =
          mousePos.x + this.size >= this.x && mousePos.x - this.size <= this.x;
        const bordersCond =
          canvasRef.current!.height <= this.y + this.size ||
          0 >= this.y - this.size;

        if (bordersCond || (mouseYCond && mouseXCond)) {
          this.speed *= -1;
        }
      },
      strike() {
        const nowTime = Date.now();
        if (nowTime - this.lastFire > this.strikeInterval) {
          this.bullets.push({
            ...this.bulletStats,
            y: this.y,
          });
          this.lastFire = Date.now();
        }

        const ctx = canvasRef.current!.getContext("2d");
        if (ctx !== null) {
          for (let index = 0; index < this.bullets.length; index++) {
            const bullet = this.bullets[index];

            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, 2 * Math.PI, false);
            ctx.fillStyle = bullet.bulletColor;
            ctx.fill();

            bullet.x += bullet.speed;
            this.bulletColission(bullet, index);
          }
        }
      },
      bulletColission(bullet: bulletInterface, index: number) {
        if (bullet.x >= canvasRef.current!.width || bullet.x <= 0) {
          this.bullets.splice(index, 1);
        }
        if (
          bot.x - bot.size <= bullet.x + bullet.size &&
          bot.x + bot.size >= bullet.x - bullet.size &&
          bot.y + bot.size >= bullet.y - bullet.size &&
          bot.y - bot.size <= bullet.y + bullet.size
        ) {
          this.bullets.splice(index, 1);
          setScore((prev: scoreType) => {
            return { ...prev, player: prev.player + 1 };
          });
        }
      },
      click(event: MouseEvent): boolean {
        const { clientX: mouseX, clientY: mouseY } = event;
        const canvasPos = canvasRef.current!.getBoundingClientRect();
        const mouseXCondPlayer =
          mouseX - canvasPos.x + this.size >= this.x &&
          mouseX - canvasPos.x - this.size <= this.x;

        if (
          mouseY - canvasPos.y >= this.y - 25 &&
          mouseY - canvasPos.y <= this.y + 25 &&
          mouseXCondPlayer
        ) {
          return true;
        }
        return false;
      },
    };

    const bot: playerInterface = {
      player: "bot",
      x: canvasRef.current!.width - defaultX,
      y: canvasRef.current!.height - defaultY,
      speed: -2,
      ...playerStats,
      bulletStats: {
        source: "bot",
        x: canvasRef.current!.width - defaultX,
        y: canvasRef.current!.height - defaultY,
        size: 12,
        speed: -3,
        bulletColor: "#1965e0",
      },
      bullets: [],
      lastFire: 0,
      checkColission(mousePos: mousePosType) {
        const mouseYCond =
          (mousePos.y - this.size <= this.y &&
            this.speed < 0 &&
            mousePos.y - (this.y - this.size) >= 0) ||
          (mousePos.y + this.size >= this.y &&
            this.speed > 0 &&
            mousePos.y - (this.size + this.y) <= 0);

        const mouseXCond =
          mousePos.x + this.size >= this.x && mousePos.x - this.size <= this.x;
        const bordersCond =
          canvasRef.current!.height <= this.y + this.size ||
          0 >= this.y - this.size;

        if (bordersCond || (mouseYCond && mouseXCond)) {
          this.speed *= -1;
        }
      },
      strike() {
        const nowTime = Date.now();
        if (nowTime - this.lastFire > this.strikeInterval) {
          this.bullets.push({
            ...this.bulletStats,
            y: this.y,
          });
          this.lastFire = Date.now();
        }

        const ctx = canvasRef.current!.getContext("2d");
        if (ctx !== null) {
          for (let index = 0; index < this.bullets.length; index++) {
            const bullet = this.bullets[index];

            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, 2 * Math.PI, false);
            ctx.fillStyle = bullet.bulletColor;
            ctx.fill();

            bullet.x += bullet.speed;
            this.bulletColission(bullet, index);
          }
        }
      },
      bulletColission(bullet: bulletInterface, index: number) {
        if (bullet.x >= canvasRef.current!.width || bullet.x <= 0) {
          this.bullets.splice(index, 1);
        }
        if (
          player.x - player.size <= bullet.x + bullet.size &&
          player.x + player.size >= bullet.x - bullet.size &&
          player.y + player.size >= bullet.y - bullet.size &&
          player.y - player.size <= bullet.y + bullet.size
        ) {
          this.bullets.splice(index, 1);
          setScore((prev: scoreType) => {
            return { ...prev, bot: prev.bot + 1 };
          });
        }
      },
      click(event: MouseEvent): boolean {
        const { clientX: mouseX, clientY: mouseY } = event;
        const canvasPos = canvasRef.current!.getBoundingClientRect();

        const mouseXCondBot =
          mouseX - canvasPos.x + this.size >= this.x &&
          mouseX - canvasPos.x - this.size <= this.x;

        if (
          mouseY - canvasPos.y >= this.y - 25 &&
          mouseY - canvasPos.y <= this.y + 25 &&
          mouseXCondBot
        ) {
          return true;
        }
        return false;
      },
    };

    return { player, bot };
  }
  return { player: undefined, bot: undefined };
}

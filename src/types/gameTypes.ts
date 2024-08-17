import { MouseEvent } from "react";

export interface playerInterface extends playerStatsType {
  player: "player" | "bot" | "default";
  x: number;
  y: number;
  speed: number;
  bulletStats: bulletInterface;
  bullets: bulletInterface[];
  lastFire: number;
  checkColission(mousePos: { x: number; y: number }): void;
  strike(): void;
  bulletColission(bullet: bulletInterface, index: number): void;
  click(event: MouseEvent): boolean;
}

export interface bulletInterface {
  x: number;
  y: number;
  source: "bot" | "player" | "default";
  size: number;
  speed: number;
  bulletColor: string;
}

export interface playerStatsType {
  size: number;
  color: string;
  strikeInterval: number;
}

export type playerParamsType = {
  playerSpeed: number;
  strikeInterval: number;
  bulletColor: string;
};

export type mousePosType = {
  x: number;
  y: number;
};
export type scoreType = {
  bot: number;
  player: number;
};

export type colorSelectionType = {
  bot: boolean;
  player: boolean;
};

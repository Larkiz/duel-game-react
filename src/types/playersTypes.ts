export interface playerInterface extends playerStatsType {
  player: "player" | "bot" | "default";
  x: number;
  y: number;
  speed: number;
  bulletStats: bulletInterface;
  bullets: bulletInterface[];
  lastFire: number;
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

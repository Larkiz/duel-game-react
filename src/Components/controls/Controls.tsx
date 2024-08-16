import { ChangeEvent, useState } from "react";
import { playerInterface } from "../../types/playersTypes";
type paramsType = {
  playerSpeed: number;
  strikeInterval: number;
  bulletColor: string;
};

const colors = ["red", "#1965e0", "#fcba03", "#198700", "#17008a"];
export const Controls = ({
  config,
  colorSelectionOpen,
}: {
  config: playerInterface;
  colorSelectionOpen: boolean;
}) => {
  const [params, setParams] = useState<paramsType>({
    playerSpeed: config.speed,
    strikeInterval: config.strikeInterval,
    bulletColor: config.bulletStats.bulletColor,
  });

  function speedInput(event: ChangeEvent<HTMLInputElement>) {
    const newSpeed = Number(event.target.value);

    config.speed = config.speed < 0 ? -newSpeed : newSpeed;

    setParams({ ...params, playerSpeed: newSpeed });
  }
  function strikeIntervalInput(event: ChangeEvent<HTMLInputElement>) {
    const newSpeed = Math.abs(Number(event.target.value));

    config.strikeInterval = newSpeed;
    setParams({ ...params, strikeInterval: newSpeed });
  }

  function bulletColorInput(color: string) {
    config.bulletStats.bulletColor = color;

    setParams({ ...params, bulletColor: color });
  }
  return (
    <div className="controls">
      <div>
        <div>
          <label htmlFor="playerSpeed">Speed</label>
          <input
            onChange={speedInput}
            id="playerSpeed"
            type="range"
            value={params.playerSpeed}
            min={1}
            max={2}
            step={0.1}
          />
        </div>
        <div>
          <label htmlFor="strikeSpeed">Strike speed</label>
          <input
            onChange={strikeIntervalInput}
            id="strikeSpeed"
            type="range"
            value={-params.strikeInterval}
            min={-1000}
            max={-400}
            step={50}
          />
        </div>
      </div>
      {colorSelectionOpen && (
        <div className="colors-cont">
          {colors.map((color, key) => (
            <button
              key={key}
              className={
                color === params.bulletColor
                  ? "selected set-color-btn"
                  : "set-color-btn"
              }
              style={{ backgroundColor: color }}
              onClick={() => bulletColorInput(color)}
              value={color}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

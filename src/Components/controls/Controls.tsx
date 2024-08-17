import { ChangeEvent } from "react";
import { playerParamsType } from "../../types/gameTypes";

const colors = ["red", "#1965e0", "#fcba03", "#198700", "#17008a"];

interface ControlsProps {
  config: playerParamsType;
  setParams: Function;
  colorSelectionOpen: boolean;
  right?: boolean;
}

export const Controls = ({
  config,
  setParams,
  colorSelectionOpen,
  right = false,
}: ControlsProps) => {
  function speedInput(event: ChangeEvent<HTMLInputElement>) {
    const newSpeed = Number(event.target.value);

    config.playerSpeed = config.playerSpeed < 0 ? -newSpeed : newSpeed;

    setParams({ ...config, playerSpeed: newSpeed });
  }
  function strikeIntervalInput(event: ChangeEvent<HTMLInputElement>) {
    const newSpeed = Math.abs(Number(event.target.value));

    config.strikeInterval = newSpeed;
    setParams({ ...config, strikeInterval: newSpeed });
  }

  function bulletColorInput(color: string) {
    config.bulletColor = color;

    setParams({ ...config, bulletColor: color });
  }

  const classes = right ? " controls controls-right" : "controls";

  return (
    <div className={classes}>
      <div>
        <div className="input-labled">
          <label htmlFor="playerSpeed">Speed</label>
          <input
            onChange={speedInput}
            id="playerSpeed"
            type="range"
            value={config.playerSpeed}
            min={2}
            max={3}
            step={0.1}
          />
        </div>
        <div className="input-labled">
          <label htmlFor="strikeSpeed">Strike speed</label>
          <input
            onChange={strikeIntervalInput}
            id="strikeSpeed"
            type="range"
            value={-config.strikeInterval}
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
                color === config.bulletColor
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

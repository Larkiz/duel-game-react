import { useState } from "react";
import {
  colorSelectionType,
  playerParamsType,
  scoreType,
} from "../types/gameTypes";

import { Controls } from "./controls/Controls";
import { Game } from "./game/Game";

function App() {
  const [player, setPlayerParams] = useState<playerParamsType>({
    playerSpeed: 0,
    strikeInterval: 0,
    bulletColor: "",
  });
  const [bot, setBotParams] = useState<playerParamsType>({
    playerSpeed: 0,
    strikeInterval: 0,
    bulletColor: "",
  });

  const [score, setScore] = useState<scoreType>({
    player: 0,
    bot: 0,
  });

  const [colorSelectionOpen, setColorSelection] = useState<colorSelectionType>({
    bot: false,
    player: false,
  });

  function openPlayerColorSelection() {
    setColorSelection({
      ...colorSelectionOpen,
      player: !colorSelectionOpen.player,
    });
  }
  function openBotColorSelection() {
    setColorSelection({
      ...colorSelectionOpen,
      bot: !colorSelectionOpen.bot,
    });
  }
  return (
    <div className="container">
      <Controls
        colorSelectionOpen={colorSelectionOpen.player}
        config={player}
        setParams={setPlayerParams}
      />

      <Game
        playerParams={player}
        botParams={bot}
        setScore={setScore}
        setPlayerConfig={setPlayerParams}
        setBotConfig={setBotParams}
        openBotColorSelection={openBotColorSelection}
        openPlayerColorSelection={openPlayerColorSelection}
      />
      <div className="score-table">
        <div>{score.player}</div>
        <div>:</div>
        <div>{score.bot}</div>
      </div>
      <Controls
        right
        setParams={setBotParams}
        colorSelectionOpen={colorSelectionOpen.bot}
        config={bot}
      />
    </div>
  );
}

export default App;

import { useState } from "react";
import GameCanvas from "./GameCanvas";
import ControllPanel from "./ControllPanel";
import "./App.css";

/**
 * Main application component. Manages state and layout for the graph battle app.
 */
export default function App() {
  const [funcString, setFuncString] = useState("sin(x)");
  const [shootSignal, setShootSignal] = useState(0);
  const defaultFunc = "sin(x)";

  // Triggers a new graph animation in GameCanvas
  const handleShoot = () => setShootSignal((s) => s + 1);
  // Resets the function input to the default
  const handleReset = () => setFuncString(defaultFunc);

  return (
    <div className="app-root">
      <div className="graph-section">
        <GameCanvas funcString={funcString} shootSignal={shootSignal} drawSpeed={200} />
      </div>
      <ControllPanel
        funcString={funcString}
        setFuncString={setFuncString}
        onShoot={handleShoot}
        onReset={handleReset}
      />
    </div>
  );
}
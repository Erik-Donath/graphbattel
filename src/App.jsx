import { useState } from "react";
import GameCanvas from "./GameCanvas";
import ControllPanel from "./ControllPanel";
import "./App.css";

export default function App() {
  const [funcString, setFuncString] = useState("sin(x)");

  return (
    <div className="app-root">
      <div className="graph-section">
        <GameCanvas funcString={funcString} />
      </div>
      <ControllPanel funcString={funcString} setFuncString={setFuncString} />
    </div>
  );
}
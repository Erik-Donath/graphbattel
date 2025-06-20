import GameCanvas from "./GameCanvas";
import ControllPanel from "./ControllPanel";
import "./App.css";

export default function App() {
  return (
    <div className="app-root">
      <div className="graph-section">
        <GameCanvas />
      </div>
      <ControllPanel />
    </div>
  );
}
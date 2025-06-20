import { useState, useEffect } from "react";
import GameCanvas from "./GameCanvas";
import ControllPanel from "./ControllPanel";
import "./App.css";

export default function App() {
  const [graphHeight, setGraphHeight] = useState(300);

  useEffect(() => {
    function handleResize() {
      const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
      setGraphHeight(Math.round(vh * 0.6)); // 60% of viewport height for graph
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="app-root">
      <div className="graph-section" style={{ height: graphHeight }}>
        <GameCanvas graphHeight={graphHeight} />
      </div>
      <ControllPanel />
    </div>
  );
}
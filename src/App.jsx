import './App.css';
import GameCanvas from './GameCanvas';
import ControlPanel from './ControlPanel';

function App() {
  return (
    <div className="app">
      <div className="graph-section">
        <GameCanvas />
      </div>
      <div className="control-section">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;

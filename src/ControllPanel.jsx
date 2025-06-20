export default function ControllPanel() {
  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      <div className="controls-row">
        <button>Zoom In</button>
        <button>Zoom Out</button>
        <button>Reset</button>
      </div>
      <div className="controls-row">
        <label>
          Function:
          <input type="text" defaultValue="sin(x)" />
        </label>
      </div>
    </div>
  );
}
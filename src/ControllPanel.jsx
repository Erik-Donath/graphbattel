import PropTypes from "prop-types";

/**
 * Control panel for user interaction: function input, zoom, reset, and shoot.
 * (Zoom buttons are placeholders and not yet implemented.)
 */
export default function ControllPanel({ funcString, setFuncString, onShoot, onReset }) {
  return (
    <div className="control-panel">
      <h2>Control Panel</h2>
      <div className="controls-row">
        <button onClick={onReset}>Reset</button>
        <button onClick={onShoot}>Shoot</button>
      </div>
      <div className="controls-row">
        <label>
          Function:
          <input
            type="text"
            value={funcString}
            onChange={e => setFuncString(e.target.value)}
            placeholder="Enter y = f(x)"
          />
        </label>
      </div>
    </div>
  );
}

ControllPanel.propTypes = {
  funcString: PropTypes.string.isRequired,
  setFuncString: PropTypes.func.isRequired,
  onShoot: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired
};
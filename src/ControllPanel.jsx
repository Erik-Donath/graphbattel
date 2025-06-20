import PropTypes from "prop-types";

export default function ControllPanel({ funcString, setFuncString }) {
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
  setFuncString: PropTypes.string.isRequired
}
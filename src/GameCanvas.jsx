import { useRef, useEffect } from "react";
import { create, all } from "mathjs";
import PropTypes from "prop-types";

const math = create(all, {});

const X_MIN = -20;
const X_MAX = 20;
const Y_MIN = -10;
const Y_MAX = 10;
const SAMPLE_STEP = 0.005;

function toCanvasCoords(x, y, width, height) {
  const px = ((x - X_MIN) / (X_MAX - X_MIN)) * width;
  const py = ((Y_MAX - y) / (Y_MAX - Y_MIN)) * height;
  return [px, py];
}

function drawAxes(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  const yZero = ((Y_MAX) / (Y_MAX - Y_MIN)) * height;
  ctx.beginPath();
  ctx.moveTo(0, yZero);
  ctx.lineTo(width, yZero);
  ctx.stroke();

  const xZero = ((-X_MIN) / (X_MAX - X_MIN)) * width;
  ctx.beginPath();
  ctx.moveTo(xZero, 0);
  ctx.lineTo(xZero, height);
  ctx.stroke();
  ctx.restore();
}

function drawGraph(ctx, width, height, compiled) {
  ctx.save();
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let x = X_MIN; x <= X_MAX; x += SAMPLE_STEP) {
    let scope = { x };
    let y;
    try {
      y = compiled.evaluate(scope);
      if (typeof y !== "number" || !isFinite(y)) throw new Error();
    } catch {
      started = false;
      continue;
    }
    if (y < Y_MIN || y > Y_MAX) {
      started = false;
      continue;
    }
    const [px, py] = toCanvasCoords(x, y, width, height);
    if (!started) {
      ctx.moveTo(px, py);
      started = true;
    } else {
      ctx.lineTo(px, py);
    }
  }
  ctx.stroke();
  ctx.restore();
}

function drawError(ctx, width, height, message) {
  ctx.save();
  ctx.clearRect(0, 0, width, height);
  ctx.font = "bold 1.5rem sans-serif";
  ctx.fillStyle = "#c00";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(message, width / 2, height / 2);
  ctx.restore();
}

export default function GameCanvas({ funcString = "sin(x)" }) {
  const graphRef = useRef(null);

  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let compiled;
    try {
      compiled = math.parse(funcString).compile();
    } catch {
      drawError(ctx, canvas.width / dpr, canvas.height / dpr, "Parse Error");
      return;
    }
    try {
      const test = compiled.evaluate({ x: 0 });
      if (typeof test !== "number" || !isFinite(test)) throw new Error();
    } catch {
      drawError(ctx, canvas.width / dpr, canvas.height / dpr, "Evaluation Error");
      return;
    }

    drawAxes(ctx, canvas.width / dpr, canvas.height / dpr);
    drawGraph(ctx, canvas.width / dpr, canvas.height / dpr, compiled);
  }, [funcString]);

  useEffect(() => {
    function redraw() {
      const canvas = graphRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let compiled;
      try {
        compiled = math.parse(funcString).compile();
      } catch {
        drawError(ctx, canvas.width / dpr, canvas.height / dpr, "Parse Error");
        return;
      }
      try {
        const test = compiled.evaluate({ x: 0 });
        if (typeof test !== "number" || !isFinite(test)) throw new Error();
      } catch {
        drawError(ctx, canvas.width / dpr, canvas.height / dpr, "Evaluation Error");
        return;
      }
      drawAxes(ctx, canvas.width / dpr, canvas.height / dpr);
      drawGraph(ctx, canvas.width / dpr, canvas.height / dpr, compiled);
    }
    window.addEventListener("resize", redraw);
    redraw();
    return () => window.removeEventListener("resize", redraw);
  }, [funcString]);

  return (
    <canvas
      ref={graphRef}
      className="graph-canvas"
      width={800}
      height={400}
      style={{ width: "100%", height: "100%", display: "block" }}
    />
  );
}

GameCanvas.propTypes = {
  funcString: PropTypes.string.isRequired
}
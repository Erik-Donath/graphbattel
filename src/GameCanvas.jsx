import { useRef, useEffect, useMemo } from "react";
import { create, all } from "mathjs";
import PropTypes from "prop-types";

// Math.js instance for expression parsing
const math = create(all, {});

// Graph boundaries and drawing parameters
const X_MIN = -20;
const X_MAX = 20;
const Y_MIN = -10;
const Y_MAX = 10;
const SAMPLE_STEP = 0.005;

/**
 * Converts mathematical coordinates to canvas pixel coordinates.
 */
function toCanvasCoords(x, y, width, height) {
  const px = ((x - X_MIN) / (X_MAX - X_MIN)) * width;
  const py = ((Y_MAX - y) / (Y_MAX - Y_MIN)) * height;
  return [px, py];
}

/**
 * Draws the X and Y axes on the canvas.
 */
function drawAxes(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;
  // Draw X axis
  const yZero = (Y_MAX / (Y_MAX - Y_MIN)) * height;
  ctx.beginPath();
  ctx.moveTo(0, yZero);
  ctx.lineTo(width, yZero);
  ctx.stroke();
  // Draw Y axis
  const xZero = ((-X_MIN) / (X_MAX - X_MIN)) * width;
  ctx.beginPath();
  ctx.moveTo(xZero, 0);
  ctx.lineTo(xZero, height);
  ctx.stroke();
  ctx.restore();
}

/**
 * Draws a mathematical function as a graph on the canvas.
 */
function drawGraph(ctx, width, height, compiled) {
  ctx.save();
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  let started = false;
  for (let x = X_MIN; x <= X_MAX; x += SAMPLE_STEP) {
    let y;
    try {
      y = compiled.evaluate({ x });
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

/**
 * Draws an error message centered on the canvas.
 */
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

/**
 * Checks if a point (x, y) is valid and within the visible canvas area.
 */
function checkValidPoint(compiled, x, width, height) {
  let y;
  try {
    y = compiled.evaluate({ x });
    if (typeof y !== "number" || !isFinite(y)) return { valid: false };
  } catch {
    return { valid: false };
  }
  if (y < Y_MIN || y > Y_MAX) return { valid: false };
  const [px, py] = toCanvasCoords(x, y, width, height);
  if (px >= width || px < 0 || py >= height || py < 0) return { valid: false };
  return { valid: true, y, px, py };
}

/**
 * Animates the drawing of the graph from left to right ("shooting" effect).
 * Accepts drawSpeed as a parameter.
 */
function shoot(ctx, width, height, compiled, xStart, pointsRef, onFinish, drawSpeed) {
  let x = xStart;
  let lastTimestamp = null;
  let stopped = false;

  function step(timestamp) {
    if (stopped) return;
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = (timestamp - lastTimestamp) / 1000;
    lastTimestamp = timestamp;
    const pixelStep = drawSpeed * elapsed;
    const xStep = (X_MAX - X_MIN) * (pixelStep / width);
    // Draw only 1 point per frame for true speed control
    let i = 0;
    while (i < 1 && x <= X_MAX) {
      const check = checkValidPoint(compiled, x, width, height);
      if (!check.valid) {
        stopped = true;
        break;
      }
      const { y } = check;
      pointsRef.current.push({ x, y });
      x += Math.max(SAMPLE_STEP, xStep);
      i++;
    }
    drawAxes(ctx, width, height);
    drawPoints(ctx, pointsRef.current, width, height);
    if (!stopped && x <= X_MAX) {
      pointsRef.current.x = x;
      requestAnimationFrame(step);
    } else {
      pointsRef.current.x = undefined;
      if (onFinish) onFinish();
    }
  }
  requestAnimationFrame(step);
  return () => { stopped = true; };
}

/**
 * Draws a sequence of points as a continuous line (the graph).
 */
function drawPoints(ctx, points, width, height) {
  if (!points.length) return;
  ctx.save();
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  const [startPx, startPy] = toCanvasCoords(points[0].x, points[0].y, width, height);
  ctx.moveTo(startPx, startPy);
  for (let i = 1; i < points.length; i++) {
    const [px, py] = toCanvasCoords(points[i].x, points[i].y, width, height);
    ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

/**
 * Main GameCanvas component. Renders a canvas and animates the graph drawing.
 */
export default function GameCanvas({ funcString = "sin(x)", shootSignal, drawSpeed }) {
  const graphRef = useRef(null);
  const animationRef = useRef();
  const lastShoot = useRef(0);
  const pointsRef = useRef([]); // Stores drawn points and current x

  // Compile the function string to a math.js expression
  const compiled = useMemo(() => {
    try {
      return { compiled: math.parse(funcString).compile(), error: null };
    } catch {
      return { compiled: null, error: "Parse Error" };
    }
  }, [funcString]);

  // Start animation on shootSignal, or redraw last state if not animating
  useEffect(() => {
    const canvas = graphRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    const ctx = canvas.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (compiled.error) {
      drawError(ctx, canvas.width / dpr, canvas.height / dpr, compiled.error);
      pointsRef.current = [];
      return;
    }

    drawAxes(ctx, canvas.width / dpr, canvas.height / dpr);
    if (lastShoot.current !== shootSignal) {
      lastShoot.current = shootSignal;
      if (animationRef.current) animationRef.current();
      pointsRef.current = [];
      pointsRef.current.x = X_MIN;
      animationRef.current = shoot(
        ctx,
        canvas.width / dpr,
        canvas.height / dpr,
        compiled.compiled,
        X_MIN,
        pointsRef,
        () => { animationRef.current = null; },
        drawSpeed
      );
    } else {
      drawPoints(ctx, pointsRef.current, canvas.width / dpr, canvas.height / dpr);
    }
  }, [funcString, compiled, shootSignal, drawSpeed]);

  // On resize: redraw axes and current points, continue animation if running
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
      drawAxes(ctx, canvas.width / dpr, canvas.height / dpr);
      drawPoints(ctx, pointsRef.current, canvas.width / dpr, canvas.height / dpr);
      if (typeof pointsRef.current.x === "number" && animationRef.current) {
        animationRef.current();
        animationRef.current = shoot(
          ctx,
          canvas.width / dpr,
          canvas.height / dpr,
          compiled.compiled,
          pointsRef.current.x,
          pointsRef,
          () => { animationRef.current = null; },
          drawSpeed
        );
      }
    }
    window.addEventListener("resize", redraw);
    redraw();
    return () => window.removeEventListener("resize", redraw);
  }, [funcString, compiled, shootSignal, drawSpeed]);

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
  funcString: PropTypes.string.isRequired,
  drawSpeed: PropTypes.number.isRequired,
};
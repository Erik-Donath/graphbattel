import { useRef, useEffect } from "react";

const X_MIN = -20;
const X_MAX = 20;
const Y_MIN = -10;
const Y_MAX = 10;

function drawAxes(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#888";
  ctx.lineWidth = 1;

  // X axis
  const yZero = ((Y_MAX) / (Y_MAX - Y_MIN)) * height;
  ctx.beginPath();
  ctx.moveTo(0, yZero);
  ctx.lineTo(width, yZero);
  ctx.stroke();

  // Y axis
  const xZero = ((-X_MIN) / (X_MAX - X_MIN)) * width;
  ctx.beginPath();
  ctx.moveTo(xZero, 0);
  ctx.lineTo(xZero, height);
  ctx.stroke();

  ctx.restore();
}

function toCanvasCoords(x, y, width, height) {
  const px = ((x - X_MIN) / (X_MAX - X_MIN)) * width;
  const py = ((Y_MAX - y) / (Y_MAX - Y_MIN)) * height;
  return [px, py];
}

function drawGraph(ctx, width, height) {
  ctx.save();
  ctx.strokeStyle = "#00f";
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let x = X_MIN; x <= X_MAX; x += 0.1) {
    const y = Math.sin(x);
    const [px, py] = toCanvasCoords(x, y, width, height);
    if (x === X_MIN) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.stroke();
  ctx.restore();
}

export default function GameCanvas() {
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

    drawAxes(ctx, canvas.width / dpr, canvas.height / dpr);
    drawGraph(ctx, canvas.width / dpr, canvas.height / dpr);
  }, []);

  // Resize on window change
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
      drawGraph(ctx, canvas.width / dpr, canvas.height / dpr);
    }
    window.addEventListener("resize", redraw);
    redraw();
    return () => window.removeEventListener("resize", redraw);
  }, []);

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
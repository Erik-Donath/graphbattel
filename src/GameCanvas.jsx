import { useRef, useEffect } from 'react';
import './App.css';

function GameCanvas() {
  const canvasRef = useRef(null);
  const rangeMin = -20;
  const rangeMax = 20;

  function drawAxes(ctx, canvasWidth, canvasHeight) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    ctx.beginPath();
    ctx.moveTo(0, canvasHeight / 2);
    ctx.lineTo(canvasWidth, canvasHeight / 2);
    ctx.moveTo(canvasWidth / 2, 0);
    ctx.lineTo(canvasWidth / 2, canvasHeight);
    ctx.stroke();

    const stepX = Math.floor(canvasWidth / 10);
    for (let x = 0; x <= canvasWidth; x += stepX) {
      ctx.beginPath();
      ctx.moveTo(x, canvasHeight / 2 - 5);
      ctx.lineTo(x, canvasHeight / 2 + 5);
      ctx.stroke();
      if (x !== canvasWidth / 2) {
        const label = ((x - canvasWidth / 2) / (canvasWidth / (rangeMax - rangeMin))) * (rangeMax - rangeMin) / (canvasWidth / stepX);
        ctx.fillText(label.toFixed(0), x - 6, canvasHeight / 2 + 20);
      }
    }

    const stepY = Math.floor(canvasHeight / 10);
    for (let y = 0; y <= canvasHeight; y += stepY) {
      ctx.beginPath();
      ctx.moveTo(canvasWidth / 2 - 5, y);
      ctx.lineTo(canvasWidth / 2 + 5, y);
      ctx.stroke();
      if (y !== canvasHeight / 2) {
        const label = ((canvasHeight / 2 - y) / (canvasHeight / (rangeMax - rangeMin))) * (rangeMax - rangeMin) / (canvasHeight / stepY);
        ctx.fillText(label.toFixed(0), canvasWidth / 2 + 10, y + 4);
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    drawAxes(ctx, canvasWidth, canvasHeight);
  }, []);

  return (
    <canvas
      className="game-canvas"
      ref={canvasRef}
      width={window.innerWidth * 0.95}
      height={window.innerHeight * 0.7}
    />
  );
}

export default GameCanvas;

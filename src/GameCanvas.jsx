import { useRef, useEffect, useState } from 'react';
import './App.css';

function GameCanvas() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rangeMin = -20;
  const rangeMax = 20;

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  function drawAxes(ctx, width, height) {
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    // Draw axes
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw ticks on X axis
    const tickCountX = 10;
    for (let i = 0; i <= tickCountX; i++) {
      const x = i * (width / tickCountX);
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 5);
      ctx.lineTo(x, height / 2 + 5);
      ctx.stroke();
      if (x !== width / 2) {
        const label = Math.round(((x - width / 2) / (width / (rangeMax - rangeMin))) * (rangeMax - rangeMin) / (width / (width / tickCountX)));
        ctx.fillText(label, x - 6, height / 2 + 20);
      }
    }

    // Draw ticks on Y axis
    const tickCountY = 10;
    for (let i = 0; i <= tickCountY; i++) {
      const y = i * (height / tickCountY);
      ctx.beginPath();
      ctx.moveTo(width / 2 - 5, y);
      ctx.lineTo(width / 2 + 5, y);
      ctx.stroke();
      if (y !== height / 2) {
        const label = Math.round(((height / 2 - y) / (height / (rangeMax - rangeMin))) * (rangeMax - rangeMin) / (height / (height / tickCountY)));
        ctx.fillText(label, width / 2 + 10, y + 4);
      }
    }
  }

  useEffect(() => {
    function updateSize() {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight,
        });
      }
    }

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && dimensions.width && dimensions.height) {
      canvas.width = dimensions.width;
      canvas.height = dimensions.height;
      const ctx = canvas.getContext('2d');
      drawAxes(ctx, dimensions.width, dimensions.height);
    }
  }, [dimensions]);

  return (
    <div ref={containerRef} className="game-canvas-container">
      <canvas ref={canvasRef} className="game-canvas" />
    </div>
  );
}

export default GameCanvas;

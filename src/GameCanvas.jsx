import { useRef, useEffect } from 'react';

function GameCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw coordinate system (axes, ticks, labels)
    // Set styles
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.font = '12px Arial';
    ctx.fillStyle = '#333';

    // Draw X and Y axes
    ctx.beginPath();
    // X axis
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    // Y axis
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    // Draw ticks on X axis
    for (let x = 0; x <= width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, height / 2 - 5);
      ctx.lineTo(x, height / 2 + 5);
      ctx.stroke();
      // Optional: add labels
      if (x !== width / 2) {
        const label = (x - width / 2) / 40;
        ctx.fillText(label, x - 6, height / 2 + 20);
      }
    }

    // Draw ticks on Y axis
    for (let y = 0; y <= height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(width / 2 - 5, y);
      ctx.lineTo(width / 2 + 5, y);
      ctx.stroke();
      // Optional: add labels
      if (y !== height / 2) {
        const label = (height / 2 - y) / 40;
        ctx.fillText(label, width / 2 + 10, y + 4);
      }
    }
  }, []);

  return (
    <div style={styles.container}>
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        style={styles.canvas}
      />
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },
  canvas: {
    border: '2px solid #333',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
  }
};

export default GameCanvas;

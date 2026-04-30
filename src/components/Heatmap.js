import React, { useEffect, useRef } from 'react';

const generateHeatmapData = (match) => {
  const points = [];
  const homeStrength = match.homeTeam.score + 1;
  const awayStrength = match.awayTeam.score + 1;

  // Home team activity (bottom half)
  for (let i = 0; i < homeStrength * 40; i++) {
    points.push({
      x: 20 + (Math.random() - 0.5) * 160,
      y: 140 + Math.random() * 120,
      team: 'home'
    });
  }
  // Home attacking third
  for (let i = 0; i < homeStrength * 25; i++) {
    points.push({
      x: 20 + (Math.random() - 0.5) * 120,
      y: 20 + Math.random() * 80,
      team: 'home'
    });
  }

  // Away team activity (top half)
  for (let i = 0; i < awayStrength * 40; i++) {
    points.push({
      x: 20 + (Math.random() - 0.5) * 160,
      y: 20 + Math.random() * 120,
      team: 'away'
    });
  }
  // Away attacking third
  for (let i = 0; i < awayStrength * 25; i++) {
    points.push({
      x: 20 + (Math.random() - 0.5) * 120,
      y: 160 + Math.random() * 80,
      team: 'away'
    });
  }

  return points;
};

const Heatmap = ({ match }) => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Draw pitch background
    ctx.fillStyle = '#1a5c2a';
    ctx.fillRect(0, 0, W, H);

    // Grass stripes
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#1e6b30' : '#1a5c2a';
      ctx.fillRect(0, i * (H / 6), W, H / 6);
    }

    // Draw heatmap blobs
    const points = generateHeatmapData(match);
    points.forEach(p => {
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 28);
      if (p.team === 'home') {
        gradient.addColorStop(0, 'rgba(0, 255, 135, 0.18)');
        gradient.addColorStop(1, 'rgba(0, 255, 135, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(255, 77, 109, 0.18)');
        gradient.addColorStop(1, 'rgba(255, 77, 109, 0)');
      }
      ctx.fillStyle = gradient;
      ctx.fillRect(p.x - 28, p.y - 28, 56, 56);
    });

    // Pitch lines
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.lineWidth = 1.5;

    // Outer boundary
    ctx.strokeRect(10, 10, W - 20, H - 20);

    // Centre line
    ctx.beginPath();
    ctx.moveTo(10, H / 2);
    ctx.lineTo(W - 10, H / 2);
    ctx.stroke();

    // Centre circle
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 30, 0, Math.PI * 2);
    ctx.stroke();

    // Centre dot
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, 3, 0, Math.PI * 2);
    ctx.fill();

    // Home penalty box
    const boxW = 100, boxH = 55;
    ctx.strokeRect((W - boxW) / 2, H - 10 - boxH, boxW, boxH);

    // Away penalty box
    ctx.strokeRect((W - boxW) / 2, 10, boxW, boxH);

    // Goals
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.strokeRect((W - 40) / 2, H - 10, 40, 8);
    ctx.strokeRect((W - 40) / 2, 2, 40, 8);

  }, [match]);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00ff87', display: 'inline-block' }} />
          <span style={{ color: '#00ff87' }}>{match.homeTeam.name}</span>
        </span>
        <span style={{ color: '#555', fontSize: '12px' }}>Touch Density</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
          <span style={{ color: '#ff4d6d' }}>{match.awayTeam.name}</span>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff4d6d', display: 'inline-block' }} />
        </span>
      </div>
      <canvas
        ref={canvasRef}
        width={200}
        height={300}
        style={{ width: '100%', borderRadius: '12px', display: 'block' }}
      />
    </div>
  );
};

export default Heatmap;
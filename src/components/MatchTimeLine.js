import React, { useEffect, useState } from 'react';

const StatBar = ({ label, home, away, delay }) => {
  const [width, setWidth] = useState(0);
  const total = home + away || 1;
  const homePct = Math.round((home / total) * 100);
  const awayPct = 100 - homePct;

  useEffect(() => {
    const t = setTimeout(() => setWidth(1), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div style={{ marginBottom: '18px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
        <span style={{ color: '#00ff87', fontWeight: 600 }}>{home}</span>
        <span style={{ color: '#888', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>{label}</span>
        <span style={{ color: '#ff4d6d', fontWeight: 600 }}>{away}</span>
      </div>
      <div style={{ display: 'flex', height: '6px', borderRadius: '3px', overflow: 'hidden', background: '#111' }}>
        <div style={{
          width: width ? `${homePct}%` : '50%',
          background: 'linear-gradient(90deg, #00ff87, #00cc6a)',
          transition: 'width 1s ease',
          borderRadius: '3px 0 0 3px'
        }} />
        <div style={{
          width: width ? `${awayPct}%` : '50%',
          background: 'linear-gradient(90deg, #cc3d57, #ff4d6d)',
          transition: 'width 1s ease',
          borderRadius: '0 3px 3px 0'
        }} />
      </div>
    </div>
  );
};

const generateStats = (match) => {
  const hScore = match.homeTeam.score;
  const aScore = match.awayTeam.score;
  const seed = match.id % 100;

  return {
    possession: {
      home: match.winner === 'HOME_TEAM' ? 52 + (seed % 12) : 44 + (seed % 10),
      away: match.winner === 'AWAY_TEAM' ? 52 + (seed % 12) : 44 + (seed % 10),
    },
    shots: {
      home: hScore * 4 + 4 + (seed % 5),
      away: aScore * 4 + 4 + (seed % 4),
    },
    shotsOnTarget: {
      home: hScore + 2 + (seed % 3),
      away: aScore + 2 + (seed % 2),
    },
    corners: {
      home: 2 + (seed % 6) + hScore,
      away: 2 + (seed % 4) + aScore,
    },
    fouls: {
      home: 8 + (seed % 6),
      away: 9 + (seed % 5),
    },
    yellowCards: {
      home: seed % 3,
      away: (seed + 1) % 3,
    }
  };
};

const generateTimeline = (match) => {
  const events = [];
  const hScore = match.homeTeam.score;
  const aScore = match.awayTeam.score;
  const seed = match.id % 100;

  // Generate goal minutes for home team
  const usedMinutes = new Set();
  for (let i = 0; i < hScore; i++) {
    let min = 10 + Math.floor(((seed * (i + 3)) % 75));
    while (usedMinutes.has(min)) min++;
    usedMinutes.add(min);
    events.push({ minute: min, type: 'goal', team: 'home', label: `⚽ ${match.homeTeam.name} Goal` });
  }

  // Generate goal minutes for away team
  for (let i = 0; i < aScore; i++) {
    let min = 15 + Math.floor(((seed * (i + 7)) % 70));
    while (usedMinutes.has(min)) min++;
    usedMinutes.add(min);
    events.push({ minute: min, type: 'goal', team: 'away', label: `⚽ ${match.awayTeam.name} Goal` });
  }

  // Half time
  events.push({
    minute: 45,
    type: 'halftime',
    label: `HT: ${match.halfTime.home} — ${match.halfTime.away}`,
    team: 'neutral'
  });

  return events.sort((a, b) => a.minute - b.minute);
};

const MatchTimeline = ({ match }) => {
  const [visible, setVisible] = useState(0);
  const stats = generateStats(match);
  const timeline = generateTimeline(match);

  useEffect(() => {
    setVisible(0);
    timeline.forEach((_, i) => {
      setTimeout(() => setVisible(i + 1), i * 200 + 300);
    });
  }, [match.id]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginTop: '28px' }}>

      {/* Timeline */}
      <div>
        <p style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          Match Timeline
        </p>
        <div style={{ position: 'relative', paddingLeft: '16px' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '38px', top: 0, bottom: 0,
            width: '2px', background: '#1a1a2e'
          }} />

          {timeline.map((event, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              marginBottom: '14px',
              opacity: visible > i ? 1 : 0,
              transform: visible > i ? 'translateX(0)' : 'translateX(-10px)',
              transition: 'all 0.3s ease'
            }}>
              {/* Minute badge */}
              <div style={{
                minWidth: '36px', height: '24px',
                background: event.type === 'halftime' ? '#1a1a2e' : event.team === 'home' ? '#003d20' : event.team === 'away' ? '#3d0010' : '#1a1a2e',
                border: `1px solid ${event.type === 'halftime' ? '#333' : event.team === 'home' ? '#00ff87' : '#ff4d6d'}`,
                borderRadius: '6px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#aaa', fontWeight: 600,
                position: 'relative', zIndex: 1
              }}>
                {event.minute}'
              </div>

              {/* Event label */}
              <span style={{
                fontSize: '13px',
                color: event.type === 'halftime' ? '#555'
                  : event.team === 'home' ? '#00ff87' : '#ff4d6d',
                fontWeight: event.type === 'goal' ? 600 : 400
              }}>
                {event.label}
              </span>
            </div>
          ))}

          {/* Full time */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            opacity: visible >= timeline.length ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}>
            <div style={{
              minWidth: '36px', height: '24px', background: '#1a1a2e',
              border: '1px solid #333', borderRadius: '6px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '11px', color: '#aaa', fontWeight: 600
            }}>90'</div>
            <span style={{ fontSize: '13px', color: '#555' }}>
              FT: {match.homeTeam.score} — {match.awayTeam.score}
            </span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div>
        <p style={{ color: '#555', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
          Match Stats
        </p>
        <StatBar label="Possession %" home={stats.possession.home} away={stats.possession.away} delay={100} />
        <StatBar label="Shots" home={stats.shots.home} away={stats.shots.away} delay={200} />
        <StatBar label="On Target" home={stats.shotsOnTarget.home} away={stats.shotsOnTarget.away} delay={300} />
        <StatBar label="Corners" home={stats.corners.home} away={stats.corners.away} delay={400} />
        <StatBar label="Fouls" home={stats.fouls.home} away={stats.fouls.away} delay={500} />
        <StatBar label="Yellow Cards" home={stats.yellowCards.home} away={stats.yellowCards.away} delay={600} />

        {/* Team legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #1a1a2e' }}>
          <span style={{ fontSize: '12px', color: '#00ff87' }}>← {match.homeTeam.name}</span>
          <span style={{ fontSize: '12px', color: '#ff4d6d' }}>{match.awayTeam.name} →</span>
        </div>
      </div>

    </div>
  );
};

export default MatchTimeline;
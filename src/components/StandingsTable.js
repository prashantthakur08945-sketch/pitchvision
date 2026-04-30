import React from 'react';
import { motion } from 'framer-motion';

const StandingsTable = ({ standings }) => {
  if (!standings || standings.length === 0) return null;

  const table = standings[0].table;

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: '24px', color: '#00ff87' }}>Premier League Standings</h2>
      <div style={{ background: '#0f0f1a', borderRadius: '16px', overflow: 'hidden', border: '1px solid #1a1a2e' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#111830', color: '#666', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              <th style={{ padding: '16px' }}>Pos</th>
              <th style={{ padding: '16px' }}>Team</th>
              <th style={{ padding: '16px' }}>PL</th>
              <th style={{ padding: '16px' }}>W</th>
              <th style={{ padding: '16px' }}>D</th>
              <th style={{ padding: '16px' }}>L</th>
              <th style={{ padding: '16px' }}>GD</th>
              <th style={{ padding: '16px' }}>PTS</th>
            </tr>
          </thead>
          <tbody>
            {table.map((row, index) => (
              <motion.tr
                key={row.team.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ borderBottom: '1px solid #111830', fontSize: '14px', color: '#fff' }}
              >
                <td style={{ padding: '16px', fontWeight: 700 }}>{row.position}</td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={row.team.crest} alt="" width={24} height={24} />
                    <span style={{ fontWeight: 600 }}>{row.team.shortName}</span>
                  </div>
                </td>
                <td style={{ padding: '16px', color: '#888' }}>{row.playedGames}</td>
                <td style={{ padding: '16px', color: '#888' }}>{row.won}</td>
                <td style={{ padding: '16px', color: '#888' }}>{row.draw}</td>
                <td style={{ padding: '16px', color: '#888' }}>{row.lost}</td>
                <td style={{ padding: '16px', color: row.goalDifference > 0 ? '#00ff87' : '#ff4d6d' }}>{row.goalDifference}</td>
                <td style={{ padding: '16px', fontWeight: 700, color: '#00ff87' }}>{row.points}</td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StandingsTable;

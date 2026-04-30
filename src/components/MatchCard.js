import React from 'react';

const MatchCard = ({ match, isSelected, onClick }) => {
  const isHome = match.winner === 'HOME_TEAM';
  const isAway = match.winner === 'AWAY_TEAM';

  return (
    <div onClick={onClick} style={{
      background: isSelected ? '#1a1a2e' : '#0f0f1a',
      border: isSelected ? '1px solid #00ff87' : '1px solid #222',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      marginBottom: '10px'
    }}>
      <div style={{ fontSize: '11px', color: '#666', marginBottom: '10px' }}>
        Matchday {match.matchday} · {match.date}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Home Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
          <img src={match.homeTeam.crest} alt={match.homeTeam.name} width={28} height={28} />
          <span style={{
            color: isHome ? '#00ff87' : '#fff',
            fontWeight: isHome ? 700 : 400,
            fontSize: '13px'
          }}>
            {match.homeTeam.name}
          </span>
        </div>

        {/* Score */}
        <div style={{
          display: 'flex', gap: '8px', alignItems: 'center',
          background: '#1a1a2e', borderRadius: '8px', padding: '6px 14px'
        }}>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>
            {match.homeTeam.score}
          </span>
          <span style={{ color: '#444' }}>—</span>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: '18px' }}>
            {match.awayTeam.score}
          </span>
        </div>

        {/* Away Team */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' }}>
          <span style={{
            color: isAway ? '#00ff87' : '#fff',
            fontWeight: isAway ? 700 : 400,
            fontSize: '13px'
          }}>
            {match.awayTeam.name}
          </span>
          <img src={match.awayTeam.crest} alt={match.awayTeam.name} width={28} height={28} />
        </div>
      </div>

      {/* Half time */}
      <div style={{ fontSize: '11px', color: '#555', marginTop: '8px', textAlign: 'center' }}>
        HT: {match.halfTime.home} — {match.halfTime.away}
      </div>
    </div>
  );
};

export default MatchCard;
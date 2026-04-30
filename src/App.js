import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useMatches from './hooks/useMatches';
import MatchCard from './components/MatchCard';
import Pitch3D from './components/Pitch3D';
import Heatmap from './components/Heatmap';
import MatchTimeline from './components/MatchTimeLine';
import AISummary from './components/AISummary';
import StandingsTable from './components/StandingsTable';
import axios from 'axios';

// Mock stats generator
const getMockStats = (match) => {
  return {
    possession: { home: 55, away: 45 },
    shots: { home: 12, away: 8 },
    shotsOnTarget: { home: 6, away: 3 },
    corners: { home: 5, away: 4 },
    fouls: { home: 10, away: 12 }
  };
};

const SkeletonCard = () => (
  <div style={{
    background: '#0f0f1a', border: '1px solid #111830',
    borderRadius: '12px', padding: '16px', marginBottom: '10px'
  }}>
    <div style={{ width: '60%', height: '12px', background: '#111830', borderRadius: '4px', marginBottom: '16px' }} />
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ width: '40px', height: '40px', background: '#111830', borderRadius: '50%' }} />
      <div style={{ width: '60px', height: '30px', background: '#111830', borderRadius: '8px' }} />
      <div style={{ width: '40px', height: '40px', background: '#111830', borderRadius: '50%' }} />
    </div>
  </div>
);

const StatBar = ({ label, home, away, color = '#00ff87' }) => {
  const total = home + away;
  const homePercent = (home / total) * 100;

  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#888' }}>
        <span>{home}</span>
        <span style={{ textTransform: 'uppercase', letterSpacing: '1px', fontSize: '10px' }}>{label}</span>
        <span>{away}</span>
      </div>
      <div style={{ height: '4px', background: '#111830', borderRadius: '2px', display: 'flex', overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${homePercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ height: '100%', background: color }}
        />
        <div style={{ flex: 1 }} />
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${100 - homePercent}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{ height: '100%', background: '#ff4d6d' }}
        />
      </div>
    </div>
  );
};

function App() {
  const { matches, liveMatches, loading, error } = useMatches();
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [activeTab, setActiveTab] = useState('matches');
  const [standings, setStandings] = useState(null);
  const [standingsLoading, setStandingsLoading] = useState(false);

  useEffect(() => {
    if (activeTab === 'table' && !standings) {
      setStandingsLoading(true);
      axios.get('http://localhost:5000/api/standings')
        .then(res => setStandings(res.data.standings))
        .catch(err => console.error(err))
        .finally(() => setStandingsLoading(false));
    }
  }, [activeTab, standings]);

  if (loading) return (
    <div style={{ background: '#080812', height: '100vh', display: 'flex' }}>
      <div style={{ width: '340px', padding: '24px', borderRight: '1px solid #111830' }}>
        {[1, 2, 3, 4, 5].map(i => <SkeletonCard key={i} />)}
      </div>
      <div style={{ flex: 1, padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid #1a1a2e',
          borderTop: '3px solid #00ff87', borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );

  if (error) return <div style={{ color: 'red', padding: 40 }}>Error: {error}</div>;

  return (
    <div style={{ background: '#080812', minHeight: '100vh', color: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{
        width: '340px', padding: '24px',
        borderRight: '1px solid #111830',
        overflowY: 'auto', flexShrink: 0,
        height: '100vh', position: 'sticky', top: 0
      }}>
        {/* Logo */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{
            color: '#00ff87', fontFamily: 'Space Grotesk', fontWeight: 700,
            fontSize: '22px', marginBottom: '4px', letterSpacing: '-0.5px'
          }}>
            ⚽ PitchVision
          </h1>
          <p style={{ color: '#333', fontSize: '12px' }}>Premier League · 2025/26</p>
        </div>

        {/* Tab Switcher */}
        <div style={{
          display: 'flex', background: '#0f0f1a', borderRadius: '10px',
          padding: '4px', marginBottom: '24px', border: '1px solid #111830'
        }}>
          <button
            onClick={() => setActiveTab('matches')}
            style={{
              flex: 1, border: 'none', borderRadius: '7px', padding: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              background: activeTab === 'matches' ? '#1a1a2e' : 'transparent',
              color: activeTab === 'matches' ? '#00ff87' : '#555',
              transition: 'all 0.2s'
            }}>
            Matches
          </button>
          <button
            onClick={() => setActiveTab('table')}
            style={{
              flex: 1, border: 'none', borderRadius: '7px', padding: '8px',
              fontSize: '12px', fontWeight: 600, cursor: 'pointer',
              background: activeTab === 'table' ? '#1a1a2e' : 'transparent',
              color: activeTab === 'table' ? '#00ff87' : '#555',
              transition: 'all 0.2s'
            }}>
            Table
          </button>
        </div>

        <div style={{ opacity: activeTab === 'matches' ? 1 : 0.3, pointerEvents: activeTab === 'matches' ? 'auto' : 'none', transition: 'opacity 0.3s' }}>
          {liveMatches.length > 0 && (
            <div style={{
              background: '#0d2010', border: '1px solid #00ff87',
              borderRadius: '8px', padding: '8px 12px',
              fontSize: '12px', color: '#00ff87',
              marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <span style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#00ff87', display: 'inline-block',
                animation: 'pulse 1.5s ease-in-out infinite',
              }} />
              {liveMatches.length} match{liveMatches.length > 1 ? 'es' : ''} live now
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
            </div>
          )}

          <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
            Recent Results
          </p>

          {matches.map(match => (
            <MatchCard
              key={match.id}
              match={match}
              isSelected={selectedMatch?.id === match.id}
              onClick={() => setSelectedMatch(match)}
            />
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {standingsLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '100px' }}>
                   <div style={{ width: '40px', height: '40px', border: '3px solid #1a1a2e', borderTop: '3px solid #00ff87', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                </div>
              ) : (
                <StandingsTable standings={standings} />
              )}
            </motion.div>
          ) : selectedMatch ? (
            <motion.div
              key={selectedMatch.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {/* Match Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '20px',
                marginBottom: '32px', paddingBottom: '24px',
                borderBottom: '1px solid #111830'
              }}>
                <img src={selectedMatch.homeTeam.crest} width={48} height={48} alt=""
                  style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,135,0.2))' }} />
                <div style={{ flex: 1 }}>
                  <h2 style={{
                    fontSize: '24px', fontWeight: 700, margin: '0 0 6px',
                    letterSpacing: '-0.5px'
                  }}>
                    <span style={{ color: selectedMatch.winner === 'HOME_TEAM' ? '#00ff87' : '#fff' }}>
                      {selectedMatch.homeTeam.name}
                    </span>
                    <span style={{
                      margin: '0 16px', color: '#fff',
                      background: '#0f0f1a', padding: '4px 16px',
                      borderRadius: '8px', fontSize: '22px',
                      border: '1px solid #1a1a2e'
                    }}>
                      {selectedMatch.homeTeam.score} — {selectedMatch.awayTeam.score}
                    </span>
                    <span style={{ color: selectedMatch.winner === 'AWAY_TEAM' ? '#ff4d6d' : '#fff' }}>
                      {selectedMatch.awayTeam.name}
                    </span>
                  </h2>
                  <p style={{ color: '#444', fontSize: '13px', margin: 0 }}>
                    Matchday {selectedMatch.matchday} · {selectedMatch.date} · Full Time
                  </p>
                </div>
                <img src={selectedMatch.awayTeam.crest} width={48} height={48} alt=""
                  style={{ filter: 'drop-shadow(0 0 8px rgba(255,77,109,0.2))' }} />
              </div>

              {/* Two column layout */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '28px', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      3D Formation View · 4-3-3
                    </p>
                    <Pitch3D match={selectedMatch} />
                  </div>
                  <AISummary match={selectedMatch} stats={getMockStats(selectedMatch)} />
                  <MatchTimeline match={selectedMatch} />
                </div>
                <div>
                  <div style={{ marginBottom: '32px' }}>
                    <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px' }}>
                      Match Statistics
                    </p>
                    <div style={{ background: '#0f0f1a', padding: '24px', borderRadius: '16px', border: '1px solid #1a1a2e' }}>
                      <StatBar label="Possession" home={55} away={45} />
                      <StatBar label="Shots" home={14} away={9} />
                      <StatBar label="Shots on Target" home={6} away={4} />
                      <StatBar label="Corners" home={8} away={5} />
                      <StatBar label="Fouls" home={11} away={13} />
                    </div>
                  </div>
                  <div>
                    <p style={{ color: '#333', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>
                      Touch Heatmap
                    </p>
                    <Heatmap match={selectedMatch} />
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              height: '80vh', flexDirection: 'column', gap: '12px'
            }}>
              <p style={{ fontSize: '48px' }}>⚽</p>
              <p style={{ color: '#222', fontSize: '16px' }}>Select a match to visualize</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
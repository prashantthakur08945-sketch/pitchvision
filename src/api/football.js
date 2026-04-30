import axios from 'axios';

const baseURL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : 'http://localhost:5000/api';

const client = axios.create({
  baseURL
});

export const getCompetitionMatches = async () => {
  const response = await client.get('/matches');
  return response.data;
};

export const getRecentMatches = (matches) => {
  return matches
    .filter(m => m.status === 'FINISHED')
    .sort((a, b) => new Date(b.utcDate) - new Date(a.utcDate))
    .slice(0, 10);
};

export const getLiveMatches = (matches) => {
  return matches.filter(m => m.status === 'IN_PLAY' || m.status === 'PAUSED');
};

export const formatMatch = (match) => ({
  id: match.id,
  date: new Date(match.utcDate).toLocaleDateString(),
  status: match.status,
  matchday: match.matchday,
  homeTeam: {
    name: match.homeTeam.shortName,
    crest: match.homeTeam.crest,
    score: match.score.fullTime.home
  },
  awayTeam: {
    name: match.awayTeam.shortName,
    crest: match.awayTeam.crest,
    score: match.score.fullTime.away
  },
  winner: match.score.winner,
  halfTime: match.score.halfTime
});
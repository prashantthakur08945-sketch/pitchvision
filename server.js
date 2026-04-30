const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
const path = require('path');

app.use(cors());
app.use(express.json());

// API Endpoints
app.get('/api/matches', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/matches', {
      headers: { 'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY },
      timeout: 5000 // Fast timeout to trigger mock data
    });
    res.json(response.data);
  } catch (err) {
    console.log('Using Mock Match Data (API Blocked)');
    res.json({
      matches: [
        { 
          id: 1, 
          utcDate: '2024-03-30T15:00:00Z',
          homeTeam: { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' }, 
          awayTeam: { name: 'Man City', crest: 'https://crests.football-data.org/65.png' }, 
          status: 'FINISHED', 
          matchday: 28,
          score: {
            fullTime: { home: 2, away: 1 },
            halfTime: { home: 1, away: 0 },
            winner: 'HOME_TEAM'
          }
        },
        { 
          id: 2, 
          utcDate: '2024-03-31T16:30:00Z',
          homeTeam: { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' }, 
          awayTeam: { name: 'Chelsea', crest: 'https://crests.football-data.org/61.png' }, 
          status: 'FINISHED', 
          matchday: 28,
          score: {
            fullTime: { home: 3, away: 0 },
            halfTime: { home: 1, away: 0 },
            winner: 'HOME_TEAM'
          }
        },
        { 
          id: 3, 
          utcDate: '2024-04-01T19:00:00Z',
          homeTeam: { name: 'Man Utd', crest: 'https://crests.football-data.org/66.png' }, 
          awayTeam: { name: 'Tottenham', crest: 'https://crests.football-data.org/73.png' }, 
          status: 'FINISHED', 
          matchday: 28,
          score: {
            fullTime: { home: 1, away: 1 },
            halfTime: { home: 0, away: 1 },
            winner: 'DRAW'
          }
        }
      ]
    });
  }
});

app.get('/api/standings', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: { 'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY },
      timeout: 5000
    });
    res.json(response.data);
  } catch (err) {
    console.log('Using Mock Standings Data');
    res.json({
      standings: [{
        table: [
          { position: 1, team: { name: 'Arsenal', crest: 'https://crests.football-data.org/57.png' }, playedGames: 28, won: 20, draw: 4, lost: 4, goalDifference: 45, points: 64 },
          { position: 2, team: { name: 'Liverpool', crest: 'https://crests.football-data.org/64.png' }, playedGames: 28, won: 19, draw: 7, lost: 2, goalDifference: 39, points: 64 },
          { position: 3, team: { name: 'Man City', crest: 'https://crests.football-data.org/65.png' }, playedGames: 28, won: 19, draw: 6, lost: 3, goalDifference: 35, points: 63 }
        ]
      }]
    });
  }
});

app.post('/api/ai-summary', async (req, res) => {
  const { match, stats } = req.body;

  try {
    const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `You are a Premier League football pundit. Give a sharp, engaging 3-sentence match summary.

Match: ${match.homeTeam.name} ${match.homeTeam.score} - ${match.awayTeam.score} ${match.awayTeam.name}
Matchday: ${match.matchday}
Half Time: ${match.halfTime.home} - ${match.halfTime.away}
Winner: ${match.winner}
Stats: ${JSON.stringify(stats)}

Be pundit-like, specific, and mention key stats. No bullet points, just flowing analysis.`
      }]
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.Groq_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const text = response.data.choices[0].message.content;
    res.json({ summary: text });
  } catch (err) {
    console.error('Groq AI Error:', err.response?.data || err.message);
    res.status(500).json({ error: err.message });
  }
});

// Serve Static Files in Production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  
  // Standard catch-all for React routing
  app.use((req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
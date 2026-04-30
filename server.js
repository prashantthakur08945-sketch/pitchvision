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
      headers: {
        'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY
      },
      params: { status: 'LIVE,IN_PLAY,PAUSED,FINISHED' }
    });
    res.json(response.data);
  } catch (err) {
    console.error('API Error:', err.response?.status, err.response?.data);
    res.status(500).json({ error: err.message, details: err.response?.data });
  }
});

app.get('/api/standings', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/competitions/PL/standings', {
      headers: {
        'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY
      }
    });
    res.json(response.data);
  } catch (err) {
    console.error('Standings API Error:', err.response?.status, err.response?.data);
    res.status(500).json({ error: err.message, details: err.response?.data });
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
  
  app.get('(.*)', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
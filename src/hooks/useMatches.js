import { useState, useEffect } from 'react';
import { getCompetitionMatches, getRecentMatches, getLiveMatches, formatMatch } from '../api/football';

const useMatches = () => {
  const [matches, setMatches] = useState([]);
  const [liveMatches, setLiveMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await getCompetitionMatches();
        const recent = getRecentMatches(data.matches).map(formatMatch);
        const live = getLiveMatches(data.matches).map(formatMatch);
        setMatches(recent);
        setLiveMatches(live);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();

    // Auto refresh every 60 seconds
    const interval = setInterval(fetchMatches, 60000);
    return () => clearInterval(interval);
  }, []);

  return { matches, liveMatches, loading, error };
};

export default useMatches;
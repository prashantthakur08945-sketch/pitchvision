import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const AISummary = ({ match, stats }) => {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    setSummary('');
    try {
      const apiBase = process.env.NODE_ENV === 'production' ? '/api' : 'http://localhost:5000/api';
      const res = await axios.post(`${apiBase}/ai-summary`, { match, stats });
      setSummary(res.data.summary);
    } catch (err) {
      setSummary('Could not generate summary. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      background: '#0f0f1a',
      border: '1px solid #1a1a2e',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <span style={{ color: '#666', fontSize: '11px', letterSpacing: '1px' }}>AI MATCH SUMMARY</span>
        <button onClick={generate} disabled={loading} style={{
          background: loading ? '#1a1a2e' : '#00ff87',
          color: loading ? '#666' : '#000',
          border: 'none',
          borderRadius: '8px',
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: loading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s'
        }}>
          {loading ? 'Analyzing...' : '⚡ Generate Analysis'}
        </button>
      </div>

      <AnimatePresence>
        {summary && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ color: '#ccc', fontSize: '14px', lineHeight: '1.7', margin: 0 }}
          >
            {summary}
          </motion.p>
        )}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ display: 'flex', gap: '6px', alignItems: 'center' }}
          >
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                style={{ width: 8, height: 8, borderRadius: '50%', background: '#00ff87' }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AISummary;

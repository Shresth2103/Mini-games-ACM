import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import acmLogo from './assets/acm_logo.png';

// Import your games here
import MonkeyType from './games/MonkeyType/App';
import WordleClone from './games/Wordle';
import Pacman from './games/Pacman/App';
import MemeDecoder from './games/MemeDecoder/App';
import Emoji from './games/Emoji/Emoji';

const GAMES = [
  { id: 'monkeytype', name: 'MonkeyType', icon: '⌨️', component: MonkeyType },
  { id: 'wordle', name: 'Wordle', icon: '🎯', component: WordleClone },
  { id: 'pacman', name: 'Pacman', icon: '👾', component: Pacman },
  { id: 'memeDecoder', name: 'Meme Decoder', icon: '🎭', component: MemeDecoder },
  { id: 'emoji', name: 'Emoji Game', icon: '😂', component: Emoji },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Session Check
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) navigate('/admin');
  }, [navigate]);

  // 2. Data Fetching
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          throw new Error('Backend offline');
        }
      } catch (error) {
        console.log('⚠️ Backend unreachable, using mock data');
        setTeams(getMockLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000); // Live update every 5s
    return () => clearInterval(interval);
  }, []);

  const getMockLeaderboard = () => [
    { teamName: 'Tech Ninjas', monkeytypeScore: 85, wordleScore: 45, pacmanScore: 1200, memodecoderScore: 65, emojiScore: 9, totalScore: 2404 },
    { teamName: 'Code Warriors', monkeytypeScore: 78, wordleScore: 50, pacmanScore: 950, memodecoderScore: 70, emojiScore: 10, totalScore: 2158 },
    { teamName: 'Algorithm Masters', monkeytypeScore: 92, wordleScore: 40, pacmanScore: 1100, memodecoderScore: 60, emojiScore: 8, totalScore: 2300 },
    { teamName: 'Debug Squad', monkeytypeScore: 72, wordleScore: 35, pacmanScore: 800, memodecoderScore: 55, emojiScore: 7, totalScore: 1769 },
    { teamName: 'Pixel Pushers', monkeytypeScore: 88, wordleScore: 48, pacmanScore: 1050, memodecoderScore: 68, emojiScore: 9, totalScore: 2263 },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    navigate('/');
  };

  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  if (selectedGame) {
    return <AdminGameViewer gameId={selectedGame} onClose={() => setSelectedGame(null)} />;
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar / Navigation */}
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <img src={acmLogo} alt="Logo" className="nav-logo" />
          <div className="nav-text">
            <h1>Admin Panel</h1>
            <p>Dev Relay 2026</p>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout}>
          Sign Out
        </button>
      </nav>

      <main className="dashboard-content">
        {/* Stats Row */}
        <div className="stats-row">
          <div className="stat-card">
            <h3>Active Teams</h3>
            <p className="stat-number">{teams.length}</p>
          </div>
          <div className="stat-card highlight">
            <h3>Top Score</h3>
            <p className="stat-number">{sortedTeams[0]?.totalScore || 0}</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="dashboard-grid">
          
          {/* Left: Leaderboard */}
          <section className="panel leaderboard-panel">
            <div className="panel-header">
              <h2>🏆 Live Standings</h2>
              <span className="live-indicator">● LIVE</span>
            </div>
            
            <div className="table-container">
              {loading ? (
                <div className="loading-state">Syncing Data...</div>
              ) : (
                <table className="modern-table">
                  <thead>
                    <tr>
                      <th className="th-rank">Rank</th>
                      <th className="th-team">Team</th>
                      <th>Monkey</th>
                      <th>Wordle</th>
                      <th>Pacman</th>
                      <th>Meme</th>
                      <th>Emoji</th>
                      <th className="th-total">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedTeams.map((team, index) => (
                      <tr key={team.teamName} className={`rank-row rank-${index + 1}`}>
                        <td className="td-rank">
                          <RankBadge index={index} />
                        </td>
                        <td className="td-team">{team.teamName}</td>
                        <td>{team.monkeytypeScore}</td>
                        <td>{team.wordleScore}</td>
                        <td>{team.pacmanScore}</td>
                        <td>{team.memodecoderScore}</td>
                        <td>{team.emojiScore}</td>
                        <td className="td-total">{team.totalScore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>

          {/* Right: Game Launcher */}
          <section className="panel games-panel">
            <div className="panel-header">
              <h2>🕹️ Game Monitor</h2>
            </div>
            <div className="games-grid">
              {GAMES.map((game) => (
                <div key={game.id} className="game-card" onClick={() => setSelectedGame(game.id)}>
                  <div className="game-icon-circle">{game.icon}</div>
                  <div className="game-info">
                    <h3>{game.name}</h3>
                    <span>Click to Test</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Helper: Renders the rank icon
const RankBadge = ({ index }) => {
  if (index === 0) return <span className="badge gold">🥇 1st</span>;
  if (index === 1) return <span className="badge silver">🥈 2nd</span>;
  if (index === 2) return <span className="badge bronze">🥉 3rd</span>;
  return <span className="badge normal">#{index + 1}</span>;
};

// Sub-Component: The Full Screen Game Viewer
function AdminGameViewer({ gameId, onClose }) {
  const gameConfig = GAMES.find((g) => g.id === gameId);
  const GameComponent = gameConfig?.component;

  return (
    <div className="game-viewer-overlay">
      <div className="viewer-topbar">
        <button onClick={onClose} className="back-button">
          ← Exit Test Mode
        </button>
        <h2>Currently Testing: <span className="highlight-text">{gameConfig?.name}</span></h2>
        <div className="status-badge">🟢 System Online</div>
      </div>
      <div className="viewer-stage">
        {GameComponent ? <GameComponent /> : <p>Game component not found.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
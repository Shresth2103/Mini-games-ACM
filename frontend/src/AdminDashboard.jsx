import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';
import acmLogo from './assets/acm_logo.png';
import MonkeyType from './games/MonkeyType/App';
import WordleClone from './games/Wordle';
import Pacman from './games/Pacman/App';
import MemeDecoder from './games/MemeDecoder/App';
import Emoji from './games/Emoji/Emoji';

const GAMES = [
  { id: 'monkeytype', name: 'MonkeyType', color: '#667eea', component: MonkeyType },
  { id: 'wordle', name: 'Wordle', color: '#764ba2', component: WordleClone },
  { id: 'pacman', name: 'Pacman', color: '#f093fb', component: Pacman },
  { id: 'memeDecoder', name: 'MemeDecoder', color: '#4facfe', component: MemeDecoder },
  { id: 'emoji', name: 'Emoji', color: '#43e97b', component: Emoji },
];

function AdminDashboard() {
  const navigate = useNavigate();
  const [teams, setTeams] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check admin session
  useEffect(() => {
    const adminSession = localStorage.getItem('adminSession');
    if (!adminSession) {
      navigate('/admin');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch leaderboard data from backend
    const fetchLeaderboard = async () => {
      try {
        // Try to fetch from backend first
        const response = await fetch('http://localhost:5000/api/leaderboard');
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          throw new Error('Backend not available');
        }
      } catch (error) {
        console.log('Using sample data');
        setTeams(getMockLeaderboard());
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
    // Refresh every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  const getMockLeaderboard = () => [
    { 
      teamName: 'Tech Ninjas', 
      monkeytypeScore: 85, 
      wordleScore: 45, 
      pacmanScore: 1200, 
      memodecoderScore: 65, 
      emojiScore: 9, 
      totalScore: 2404 
    },
    { 
      teamName: 'Code Warriors', 
      monkeytypeScore: 78, 
      wordleScore: 50, 
      pacmanScore: 950, 
      memodecoderScore: 70, 
      emojiScore: 10, 
      totalScore: 2158 
    },
    { 
      teamName: 'Algorithm Masters', 
      monkeytypeScore: 92, 
      wordleScore: 40, 
      pacmanScore: 1100, 
      memodecoderScore: 60, 
      emojiScore: 8, 
      totalScore: 2300 
    },
    { 
      teamName: 'Debug Squad', 
      monkeytypeScore: 72, 
      wordleScore: 35, 
      pacmanScore: 800, 
      memodecoderScore: 55, 
      emojiScore: 7, 
      totalScore: 1769 
    },
    { 
      teamName: 'Pixel Pushers', 
      monkeytypeScore: 88, 
      wordleScore: 48, 
      pacmanScore: 1050, 
      memodecoderScore: 68, 
      emojiScore: 9, 
      totalScore: 2263 
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminSession');
    localStorage.removeItem('adminLoginTime');
    navigate('/');
  };

  const handleViewGame = (gameId) => {
    setSelectedGame(gameId);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
  };

  const sortedTeams = [...teams].sort((a, b) => b.totalScore - a.totalScore);

  if (selectedGame) {
    return <AdminGameViewer gameId={selectedGame} onClose={handleCloseGame} />;
  }

  return (
    <div className="admin-dashboard">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo-section">
            <img src={acmLogo} alt="ACM Logo" className="admin-logo" />
            <div>
              <h1>Admin Dashboard</h1>
              <p>DEV RELAY - Team Rankings</p>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          {/* Leaderboard Section */}
          <section className="leaderboard-section">
            <div className="section-header">
              <h2>🏆 Leaderboard</h2>
              <span className="team-count">{teams.length} Teams</span>
            </div>

            {loading ? (
              <div className="loading">Loading leaderboard...</div>
            ) : (
              <div className="leaderboard-wrapper">
                <div className="leaderboard-table">
                  <div className="table-header">
                    <div className="rank">Rank</div>
                    <div className="team-name">Team Name</div>
                    <div className="score-column">Monkey</div>
                    <div className="score-column">Wordle</div>
                    <div className="score-column">Pacman</div>
                    <div className="score-column">Meme</div>
                    <div className="score-column">Emoji</div>
                    <div className="total-score">Total</div>
                  </div>

                  <div className="table-body">
                    {sortedTeams.map((team, index) => (
                      <div key={team.teamName} className={`table-row ${index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : ''}`}>
                        <div className="rank">
                          {index === 0 && '🥇'}
                          {index === 1 && '🥈'}
                          {index === 2 && '🥉'}
                          {index > 2 && `#${index + 1}`}
                        </div>
                        <div className="team-name">{team.teamName}</div>
                        <div className="score-column">{team.monkeytypeScore}</div>
                        <div className="score-column">{team.wordleScore}</div>
                        <div className="score-column">{team.pacmanScore}</div>
                        <div className="score-column">{team.memodecoderScore}</div>
                        <div className="score-column">{team.emojiScore}</div>
                        <div className="total-score">
                          <strong>{team.totalScore}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Games Section */}
          <section className="games-section">
            <div className="section-header">
              <h2>🎮 Test Games</h2>
            </div>

            <div className="games-grid">
              {GAMES.map(game => (
                <button
                  key={game.id}
                  className="game-card"
                  style={{ borderTopColor: game.color }}
                  onClick={() => handleViewGame(game.id)}
                >
                  <div className="game-title">{game.name}</div>
                  <div className="game-icon">
                    {game.id === 'monkeytype' && '⌨️'}
                    {game.id === 'wordle' && '🎯'}
                    {game.id === 'pacman' && '👾'}
                    {game.id === 'memeDecoder' && '🎭'}
                    {game.id === 'emoji' && '😂'}
                  </div>
                  <div className="view-label">Click to Test</div>
                </button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

// Admin Game Viewer - Shows real games for testing
function AdminGameViewer({ gameId, onClose }) {
  const gameConfig = GAMES.find(g => g.id === gameId);
  const GameComponent = gameConfig?.component;

  return (
    <div className="admin-game-viewer">
      <div className="viewer-header">
        <button className="back-btn" onClick={onClose}>← Back to Dashboard</button>
        <h2>{gameConfig?.name} - Test View</h2>
        <div style={{ width: '80px' }}></div>
      </div>

      <div className="viewer-content">
        <div className="game-frame">
          <div className="admin-badge">TEST MODE</div>
          {GameComponent && <GameComponent />}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

import React, { useState, useEffect, useRef } from 'react';
import MonkeyType from './games/MonkeyType/App';
import WordleClone from './games/Wordle';
import Pacman from './games/Pacman/App';
import MemeDecoder from './games/MemeDecoder/App';
import Emoji from './games/Emoji/Emoji';
import { useGameCompletion } from './GameContext';
import './GameSequence.css';

const GAMES = [
  { id: 'monkeytype', name: 'MonkeyType', component: MonkeyType },
  { id: 'wordle', name: 'Wordle', component: WordleClone },
  { id: 'pacman', name: 'Pacman', component: Pacman },
  { id: 'memeDecoder', name: 'MemeDecoder', component: MemeDecoder },
  { id: 'emoji', name: 'Emoji', component: Emoji },
];

// Wrapper for MonkeyType - detects ONLY when result is shown AND typing input is hidden
function MonkeyTypeWrapper({ onGameComplete }) {
  const containerRef = useRef(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const checkForCompletion = () => {
      // Check for ResultView specific content
      const text = containerRef.current?.textContent || '';
      const hasPassMessage = text.includes('Congrats, you passed') || text.includes('Threshold not met');
      const hasStats = text.includes('WPM') && text.includes('Accuracy') && text.includes('Raw WPM');
      
      // Check that typing test input is NOT visible (ResultView doesn't have input)
      const typingInput = containerRef.current?.querySelector('input[type="text"]');
      const isInputHidden = !typingInput || typingInput.offsetParent === null;
      
      // Check for restart/retry button
      const restartButton = Array.from(containerRef.current?.querySelectorAll('button') || []).some(btn => {
        const text = btn.textContent || '';
        return text.includes('Try Again') || text.includes('Retry');
      });

      // Only trigger when ALL specific ResultView indicators are present
      if (hasPassMessage && hasStats && isInputHidden && restartButton && !hasDetectedRef.current) {
        hasDetectedRef.current = true;
        onGameComplete();
      }
    };

    const observer = new MutationObserver(checkForCompletion);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    // Also check periodically in case mutations aren't caught
    const interval = setInterval(checkForCompletion, 1000);

    return () => {
      observer.disconnect();
      clearInterval(interval);
    };
  }, [onGameComplete]);

  return (
    <div ref={containerRef}>
      <MonkeyType />
    </div>
  );
}

// Wrapper for Wordle - play exactly 3 games then move to next
function WordleWrapper({ onGameComplete }) {
  const containerRef = useRef(null);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const prevWinsRef = useRef(0);

  useEffect(() => {
    const checkGameCompletion = () => {
      // Look for the "Total wins:" text to track completed games
      const allText = containerRef.current?.innerText || '';
      const winsMatch = allText.match(/Total wins:\s*(\d+)/);
      const currentWins = winsMatch ? parseInt(winsMatch[1]) : 0;

      // When total wins increases, a game was completed
      if (currentWins > prevWinsRef.current) {
        prevWinsRef.current = currentWins;
        const newCount = gamesPlayed + 1;
        setGamesPlayed(newCount);

        // After 3 games, trigger completion
        if (newCount >= 3) {
          setTimeout(() => onGameComplete(), 1500);
        }
      }
    };

    const interval = setInterval(checkGameCompletion, 500);
    return () => clearInterval(interval);
  }, [gamesPlayed, onGameComplete]);

  return (
    <div ref={containerRef}>
      <WordleClone />
    </div>
  );
}

// Wrapper for Pacman - only complete when ALL 4 LEVELS are beaten (MISSION COMPLETE)
function PacmanWrapper({ onGameComplete, teamName }) {
  const containerRef = useRef(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const checkForCompletion = () => {
      const text = containerRef.current?.textContent || '';
      
      // ONLY trigger on MISSION COMPLETE (all 4 levels done)
      // GAME OVER means lost at a level, so DO NOT trigger
      const hasMissionComplete = text.includes('MISSION COMPLETE');
      
      // Check for restart button on the leaderboard
      const hasRestartButton = Array.from(containerRef.current?.querySelectorAll('button') || []).some(btn =>
        btn.textContent?.includes('PLAY AGAIN')
      );

      // Only trigger when MISSION COMPLETE AND restart button are visible
      // This ensures all 4 levels were beaten
      if (hasMissionComplete && hasRestartButton && !hasDetectedRef.current) {
        hasDetectedRef.current = true;
        setTimeout(() => onGameComplete(), 1500);
      }
    };

    const observer = new MutationObserver(checkForCompletion);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [onGameComplete]);

  return (
    <div ref={containerRef}>
      <Pacman initialTeamName={teamName} />
    </div>
  );
}

// Wrapper for MemeDecoder - detects ONLY when gameState is 'won' or 'lost' (shows results)
function MemeDecoderWrapper({ onGameComplete }) {
  const containerRef = useRef(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const checkForCompletion = () => {
      const text = containerRef.current?.textContent || '';
      
      // Check for game end states - only show after time is up or all memes guessed
      const hasGameEnd = 
        text.includes('Time\'s Up') ||
        text.includes('Mission Complete') ||
        text.includes('Final Score') ||
        (text.includes('Score') && text.includes('SCORE:'));

      // Make sure the input/game area is hidden (meaning game is over)
      const hasHiddenGameInput = !containerRef.current?.querySelector('input#meme-input') ||
        containerRef.current?.querySelector('input#meme-input')?.style.display === 'none';

      // Only trigger when game is actually ended
      if (hasGameEnd && hasHiddenGameInput && !hasDetectedRef.current) {
        hasDetectedRef.current = true;
        setTimeout(() => onGameComplete(), 1500);
      }
    };

    const observer = new MutationObserver(checkForCompletion);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [onGameComplete]);

  return (
    <div ref={containerRef}>
      <MemeDecoder />
    </div>
  );
}

// Wrapper for Emoji - detects ONLY when gameStatus is 'finished' (shows completion screen)
function EmojiWrapper({ onGameComplete }) {
  const containerRef = useRef(null);
  const hasDetectedRef = useRef(false);

  useEffect(() => {
    const checkForCompletion = () => {
      const text = containerRef.current?.textContent || '';
      
      // Check for game complete screen with trophy and score
      const hasGameComplete = text.includes('Game Complete');
      const hasScore = text.includes('Score') && text.includes('/');
      const hasPlayAgainButton = Array.from(containerRef.current?.querySelectorAll('button') || []).some(btn =>
        btn.textContent?.includes('Play Again')
      );

      // Only trigger when ALL completion indicators are present
      if (hasGameComplete && hasScore && hasPlayAgainButton && !hasDetectedRef.current) {
        hasDetectedRef.current = true;
        setTimeout(() => onGameComplete(), 1500);
      }
    };

    const observer = new MutationObserver(checkForCompletion);
    if (containerRef.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => observer.disconnect();
  }, [onGameComplete]);

  return (
    <div ref={containerRef}>
      <Emoji />
    </div>
  );
}

function GameSequence() {
  const [currentGameIndex, setCurrentGameIndex] = useState(0);
  const [showTransition, setShowTransition] = useState(false);
  const { teamName } = useGameCompletion();

  const currentGame = GAMES[currentGameIndex];

  const handleGameComplete = () => {
    console.log(`✅ ${currentGame.name} completed!`);
    setShowTransition(true);

    setTimeout(() => {
      // Move to next game or show completion screen
      if (currentGameIndex < GAMES.length - 1) {
        setCurrentGameIndex(currentGameIndex + 1);
        setShowTransition(false);
      } else {
        // All games completed
        console.log('🎉 All games completed!');
      }
    }, 1000);
  };

  // Render the appropriate wrapper based on current game
  const renderGameComponent = () => {
    switch (currentGame.id) {
      case 'monkeytype':
        return <MonkeyTypeWrapper onGameComplete={handleGameComplete} />;
      case 'wordle':
        return <WordleWrapper onGameComplete={handleGameComplete} />;
      case 'pacman':
        return <PacmanWrapper onGameComplete={handleGameComplete} teamName={teamName} />;
      case 'memeDecoder':
        return <MemeDecoderWrapper onGameComplete={handleGameComplete} />;
      case 'emoji':
        return <EmojiWrapper onGameComplete={handleGameComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="game-sequence-container">
      <div className="game-progress">
        <p>Game {currentGameIndex + 1} of {GAMES.length}: {currentGame.name}</p>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${((currentGameIndex + 1) / GAMES.length) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className={`game-wrapper ${showTransition ? 'fade-out' : ''}`}>
        {renderGameComponent()}
      </div>
    </div>
  );
}

export default GameSequence;

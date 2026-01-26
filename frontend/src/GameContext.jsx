import React, { createContext, useContext, useState, useCallback } from 'react';

const GameContextInternal = createContext();

export const GameProvider = ({ children }) => {
  const [gameCompleted, setGameCompleted] = useState(false);
  const [teamName, setTeamName] = useState('');

  const completeGame = useCallback(() => {
    setGameCompleted(true);
  }, []);

  const resetGame = useCallback(() => {
    setGameCompleted(false);
  }, []);

  return (
    <GameContextInternal.Provider value={{ gameCompleted, completeGame, resetGame, teamName, setTeamName }}>
      {children}
    </GameContextInternal.Provider>
  );
};

export const useGameCompletion = () => {
  const context = useContext(GameContextInternal);
  if (!context) {
    throw new Error('useGameCompletion must be used within GameProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { AlertCircle, HelpCircle, BarChart3, Settings } from 'lucide-react';
import '../main.css'

const WORDS = ['REACT', 'CODES', 'BUILD', 'SMART', 'GRACE', 'PLANT', 'WORLD', 'BRAIN', 'FINAL', 'TRUST'];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

export default function WordleClone() {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [invalidWord, setInvalidWord] = useState(false);

  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
  }, []);

  const getLetterStatus = (letter, index, guess) => {
    if (!guess) return 'empty';
    
    if (targetWord[index] === letter) {
      return 'correct';
    } else if (targetWord.includes(letter)) {
      return 'present';
    } else {
      return 'absent';
    }
  };

  const getKeyStatus = (key) => {
    let status = 'unused';
    
    guesses.forEach(guess => {
      guess.split('').forEach((letter, index) => {
        if (letter === key) {
          if (targetWord[index] === letter) {
            status = 'correct';
          } else if (targetWord.includes(letter) && status !== 'correct') {
            status = 'present';
          } else if (status === 'unused') {
            status = 'absent';
          }
        }
      });
    });
    
    return status;
  };

  const handleKeyPress = (key) => {
    if (gameOver) return;

    if (key === 'ENTER') {
      if (currentGuess.length === WORD_LENGTH) {
        const newGuesses = [...guesses, currentGuess];
        setGuesses(newGuesses);
        
        if (currentGuess === targetWord) {
          setWon(true);
          setGameOver(true);
        } else if (newGuesses.length === MAX_ATTEMPTS) {
          setGameOver(true);
        }
        
        setCurrentGuess('');
      } else {
        setShake(true);
        setTimeout(() => setShake(false), 500);
      }
    } else if (key === 'BACK') {
      setCurrentGuess(currentGuess.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH) {
      setCurrentGuess(currentGuess + key);
    }
  };

  useEffect(() => {
    const handleKeyboard = (e) => {
      const key = e.key.toUpperCase();
      
      if (key === 'ENTER') {
        handleKeyPress('ENTER');
      } else if (key === 'BACKSPACE') {
        handleKeyPress('BACK');
      } else if (/^[A-Z]$/.test(key)) {
        handleKeyPress(key);
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [currentGuess, gameOver]);

  const renderRow = (guess, rowIndex) => {
    const isCurrentRow = rowIndex === guesses.length;
    const letters = guess ? guess.split('') : [];
    
    return (
      <div className={`flex gap-1 ${shake && isCurrentRow ? 'animate-shake' : ''}`}>
        {[...Array(WORD_LENGTH)].map((_, i) => {
          const letter = letters[i] || (isCurrentRow && currentGuess[i]) || '';
          const status = guess ? getLetterStatus(letter, i, guess) : 'empty';
          
          return (
            <div
              key={i}
              className={`w-14 h-14 border-2 flex items-center justify-center text-2xl font-bold
                ${status === 'correct' ? 'bg-green-600 border-green-600 text-white' : ''}
                ${status === 'present' ? 'bg-yellow-500 border-yellow-500 text-white' : ''}
                ${status === 'absent' ? 'bg-gray-600 border-gray-600 text-white' : ''}
                ${status === 'empty' && letter ? 'border-gray-500' : 'border-gray-700'}
                ${status === 'empty' && !letter ? 'border-gray-700' : ''}
                transition-all duration-300`}
            >
              {letter}
            </div>
          );
        })}
      </div>
    );
  };

  const keyboard = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-3xl font-bold">Wordle</h1>
          <div className="flex gap-2">
            <button className="p-2"><HelpCircle size={24} /></button>
            <button className="p-2"><BarChart3 size={24} /></button>
            <button className="p-2"><Settings size={24} /></button>
          </div>
        </div>
      </header>

      {/* Game Board */}
      <main className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col gap-1 mb-8">
          {[...Array(MAX_ATTEMPTS)].map((_, i) => (
            <div key={i}>
              {renderRow(guesses[i], i)}
            </div>
          ))}
        </div>

        {/* Game Over Message */}
        {gameOver && (
          <div className="mb-4 text-center">
            <p className="text-2xl font-bold mb-2">
              {won ? '🎉 Congratulations!' : '😔 Game Over'}
            </p>
            <p className="text-lg mb-4">
              {won ? `You won in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!` : `The word was: ${targetWord}`}
            </p>
            <button
              onClick={() => {
                const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
                setTargetWord(randomWord);
                setGuesses([]);
                setCurrentGuess('');
                setGameOver(false);
                setWon(false);
              }}
              className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition"
            >
              Play Again
            </button>
          </div>
        )}

        {/* Keyboard */}
        <div className="w-full max-w-lg">
          {keyboard.map((row, i) => (
            <div key={i} className="flex gap-1 justify-center mb-2">
              {row.map((key) => {
                const status = key.length === 1 ? getKeyStatus(key) : 'unused';
                
                return (
                  <button
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className={`h-14 rounded font-bold text-sm
                      ${key === 'ENTER' || key === 'BACK' ? 'px-4 bg-gray-600' : 'w-10'}
                      ${status === 'correct' ? 'bg-green-600' : ''}
                      ${status === 'present' ? 'bg-yellow-500' : ''}
                      ${status === 'absent' ? 'bg-gray-700' : ''}
                      ${status === 'unused' ? 'bg-gray-600' : ''}
                      hover:opacity-80 active:opacity-60 transition-all`}
                  >
                    {key === 'BACK' ? '⌫' : key}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </main>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-shake {
          animation: shake 0.5s;
        }
      `}</style>
    </div>
  );
}
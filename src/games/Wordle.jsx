import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Sparkles, Trophy } from 'lucide-react';
import '../main.css'
const WORDS = ['ABORT', 'SPEAR', 'YIELD', 'SPEED', 'ROACH', 'MEDIA', 'RHYME', 'QUAKE', 'GLORY', 'EXERT', 'STIFF', 'CHEER', 'FIERY', 'STOIC', 'WHINE', 'TROOP', 'QUEUE', 'LEVER', 'BRAVE', 'ALERT', 'HOVER', 'PIECE', 'TROUT', 'WHISK', 'VAULT', 'YOUTH', 'ROGUE', 'LOGIC', 'INEPT', 'HEIST'];
const WORD_LENGTH = 5;
const MAX_ATTEMPTS = 6;

// Configure unlock requirements here - each item unlocks after winning N games
const UNLOCK_ITEMS = [
  { id: 1, name: 'Color Palette', description: 'Vibrant color scheme unlocked', gamesRequired: 1 },
  { id: 2, name: 'Sound Effects', description: 'Audio feedback enabled', gamesRequired: 2 },
  { id: 3, name: 'Statistics', description: 'Track your progress', gamesRequired: 3 },
  { id: 4, name: 'Dark Mode', description: 'Eye-friendly theme', gamesRequired: 4 },
  { id: 5, name: 'Animations', description: 'Smooth transitions', gamesRequired: 5 },
  { id: 6, name: 'Hard Mode', description: 'Challenge yourself', gamesRequired: 6 },
];



export default function WordleClone() {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [gamesWon, setGamesWon] = useState(0);
  const [error, setError] = useState('');
  const [usedWords, setUsedWords] = useState([]);
  const [unlockedItems, setUnlockedItems] = useState([]);
  const [showUnlockAnimation, setShowUnlockAnimation] = useState(null);
  const [showUnlockModal, setShowUnlockModal] = useState(null);

  useEffect(() => {
    const availableWords = WORDS.filter(word => !usedWords.includes(word));
    const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    setTargetWord(randomWord);
    setUsedWords(prev => [...prev, randomWord]);
  }, []);

  console.log(targetWord)

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

  const checkUnlocks = (totalGamesWon) => {
    const newlyUnlocked = UNLOCK_ITEMS.filter(item => {
      return totalGamesWon === item.gamesRequired && !unlockedItems.includes(item.id);
    });

    if (newlyUnlocked.length > 0) {
      newlyUnlocked.forEach(item => {
        setUnlockedItems(prev => [...prev, item.id]);
        setShowUnlockAnimation(item.id);
        setShowUnlockModal(item);
        setTimeout(() => setShowUnlockAnimation(null), 3000);
      });
    }
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
          const newGamesWon = gamesWon + 1;
          setGamesWon(newGamesWon);
          checkUnlocks(newGamesWon);
        } else if (newGuesses.length === MAX_ATTEMPTS) {
          setGameOver(true);
        }

        setCurrentGuess('');
      } else {
        setError('Not enough letters');
        setShake(true);
        setTimeout(() => {
          setError('');
          setShake(false);
        }, 2000);
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
  }, [currentGuess, gameOver, guesses, targetWord, gamesWon, unlockedItems]); // Added missing dependencies

  const handlePlayAgain = () => {
    const availableWords = WORDS.filter(word => !usedWords.includes(word));

    // If all words have been used, reset the used words list
    if (availableWords.length === 0) {
      setUsedWords([]);
      const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
      setTargetWord(randomWord);
      setUsedWords([randomWord]);
    } else {
      const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
      setTargetWord(randomWord);
      setUsedWords(prev => [...prev, randomWord]);
    }

    setGuesses([]);
    setCurrentGuess('');
    setGameOver(false);
    setWon(false);
    setShowUnlockModal(null);
  };

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

  const isItemUnlocked = (itemId) => unlockedItems.includes(itemId);
  const lockedCount = UNLOCK_ITEMS.filter(item => !isItemUnlocked(item.id)).length;

  const getNextUnlockGames = () => {
    const nextItem = UNLOCK_ITEMS.find(item => {
      return !isItemUnlocked(item.id) && item.gamesRequired > gamesWon;
    });

    return nextItem ? nextItem.gamesRequired : null;
  };

  const nextUnlock = getNextUnlockGames();

  // Sort unlocked items to show newest first
  const sortedUnlockedItems = UNLOCK_ITEMS
    .filter(item => isItemUnlocked(item.id))
    .sort((a, b) => b.gamesRequired - a.gamesRequired);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold">Wordle</h1>
        </div>
      </header>

      {/* Unlock Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-8 rounded-2xl shadow-2xl max-w-md mx-4 animate-scaleIn">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <div className="relative">
                  <Trophy size={80} className="text-white animate-bounce" />
                  <Sparkles size={30} className="absolute -top-2 -right-2 text-yellow-200 animate-spin" />
                  <Sparkles size={25} className="absolute -bottom-1 -left-1 text-yellow-200 animate-pulse" />
                </div>
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">NEW UNLOCK!</h2>
              <div className="bg-white bg-opacity-20 rounded-lg p-6 mb-6">
                <h3 className="text-2xl font-bold text-black mb-2">{showUnlockModal.name}</h3>
                <p className="text-black text-opacity-90">{showUnlockModal.description}</p>
              </div>
              <button
                onClick={() => setShowUnlockModal(null)}
                className="bg-white text-orange-600 font-bold px-8 py-3 rounded-lg hover:bg-opacity-90 transition"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex gap-8 p-8 max-w-6xl mx-auto w-full">
        {/* Game Board */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex flex-col gap-1 mb-8">
            {[...Array(MAX_ATTEMPTS)].map((_, i) => (
              <div key={i}>
                {renderRow(guesses[i], i)}
              </div>
            ))}
          </div>
          {/* Error Message */}
          {error && (
            <div className="mb-4 bg-gray-800 border-2 border-red-500 text-red-400 px-6 py-3 rounded-lg font-bold animate-fadeIn">
              {error}
            </div>
          )}

          {/* Progress Indicator */}
          {!gameOver && nextUnlock && (
            <div className="mb-4 text-center bg-gray-800 px-6 py-3 rounded-lg border-2 border-yellow-500">
              <p className="text-sm text-gray-400">Next unlock after</p>
              <p className="text-2xl font-bold text-yellow-400">
                {nextUnlock - gamesWon} more {nextUnlock - gamesWon === 1 ? 'win' : 'wins'}
              </p>
            </div>
          )}

          {/* Game Over Message */}
          {gameOver && (
            <div className="mb-4 text-center">
              <p className="text-3xl font-bold mb-2">
                {won ? '🎉 You Won!' : '😔 Game Over'}
              </p>
              <p className="text-lg mb-2">
                {won ? `Solved in ${guesses.length} ${guesses.length === 1 ? 'try' : 'tries'}!` : `The word was: ${targetWord}`}
              </p>
              <p className="text-sm text-gray-400 mb-4">
                Total wins: {gamesWon}
              </p>
              {won && nextUnlock && (
                <p className="text-md text-yellow-400 mb-4">
                  {nextUnlock - gamesWon} more {nextUnlock - gamesWon === 1 ? 'win' : 'wins'} until next unlock!
                </p>
              )}
              <button
                onClick={handlePlayAgain}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-bold transition text-lg"
              >
                Next Word
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
                        ${status === 'absent' ? 'bg-gray-900' : ''}
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
        </div>

        {/* Unlocks Sidebar */}
        <div className="w-80 bg-gray-800 rounded-lg overflow-hidden flex flex-col" style={{ maxHeight: 'calc(100vh - 12rem)' }}>
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={24} className="text-yellow-400" />
                Unlocks
              </div>
              <div className="text-sm font-normal text-gray-400">
                {unlockedItems.length}/{UNLOCK_ITEMS.length}
              </div>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
            {/* Show unlocked items first (newest at top) */}
            {sortedUnlockedItems.map((item) => {
              const isAnimating = showUnlockAnimation === item.id;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-lg border-2 bg-green-900 border-green-500 transition-all duration-500
                    ${isAnimating ? 'scale-105 shadow-lg shadow-green-500/50 animate-pulse' : ''}
                  `}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <Unlock size={20} className="text-green-400 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <h3 className="font-bold text-white">
                        {item.name}
                      </h3>
                      <p className="text-sm mt-1 text-green-200">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-xs bg-green-600 text-white px-3 py-1 rounded-full inline-block">
                    Unlocked after {item.gamesRequired} {item.gamesRequired === 1 ? 'win' : 'wins'}
                  </div>

                  {isAnimating && (
                    <div className="mt-3 text-sm font-bold text-yellow-400 flex items-center gap-2">
                      <Sparkles size={16} className="animate-spin" />
                      NEW!
                    </div>
                  )}
                </div>
              );
            })}

            {/* Show mystery boxes for locked items */}
            {[...Array(lockedCount)].map((_, index) => (
              <div
                key={`mystery-${index}`}
                className="p-4 rounded-lg border-2 bg-gray-700 border-gray-600"
              >
                <div className="flex items-center gap-3 mb-2">
                  <Lock size={20} className="text-gray-500 flex-shrink-0" />
                  <h3 className="font-bold text-gray-500">???</h3>
                </div>
                <p className="text-sm text-gray-600">Win more games to reveal...</p>
              </div>
            ))}

            {unlockedItems.length === UNLOCK_ITEMS.length && (
              <div className="text-center py-4 mt-4 border-t-2 border-gray-700">
                <Sparkles size={48} className="mx-auto mb-3 text-yellow-400" />
                <p className="font-bold text-yellow-400 text-lg">All Unlocked!</p>
                <p className="text-sm mt-1 text-gray-400">You've discovered everything!</p>
              </div>
            )}
          </div>
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
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        @keyframes scaleIn {
          from { 
            transform: scale(0.8);
            opacity: 0;
          }
          to { 
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #4b5563;
          border-radius: 4px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #6b7280;
        }
      `}</style>
    </div>
  );
}
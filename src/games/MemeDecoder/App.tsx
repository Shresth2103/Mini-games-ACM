import React, { useState, useEffect, useRef } from 'react';
import { memeData, Meme } from './memeData';
import { Terminal, Scan, CheckCircle2, XCircle, Play, RotateCcw } from 'lucide-react';

type GameState = 'start' | 'playing' | 'won' | 'lost';

export default function MemeDecoder() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [blurAmount, setBlurAmount] = useState<number>(20);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [gameMemes, setGameMemes] = useState<Meme[]>([]);

  // Timer Effect
  useEffect(() => {
    let timer: number | undefined;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      setGameState('lost');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  // Canvas Image Rendering with Blur
  useEffect(() => {
    if (gameState !== 'playing' && gameState !== 'start') return;
    if (gameMemes.length === 0 && gameState === 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image();
    image.crossOrigin = "Anonymous";

    // Use the randomized subset
    const currentMeme = gameState === 'start' ? memeData[0] : gameMemes[currentIndex];

    // Safety check
    if (!currentMeme) return;

    image.src = currentMeme.imageUrl;

    image.onload = () => {
      // Set canvas size to match image or fixed aspect ratio
      canvas.width = 600;
      canvas.height = 400;

      // Clear previous draw
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply blur - This 'burns' the blur into the canvas bitmap
      // so turning off CSS rules won't reveal the image.
      if (gameState === 'playing') {
        ctx.filter = `blur(${blurAmount}px)`;
      } else {
        ctx.filter = 'none';
      }

      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

  }, [currentIndex, blurAmount, gameState, gameMemes]);

  const handleStart = () => {
    // Randomly select 10 memes
    const shuffled = [...memeData].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 10);
    setGameMemes(selected);

    setGameState('playing');
    setScore(0);
    setCurrentIndex(0);
    setTimeLeft(60);
    setBlurAmount(15);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const currentMeme = gameMemes[currentIndex];

    if (userInput.toLowerCase().trim() === currentMeme.answer.toLowerCase()) {
      // Correct!
      if (currentIndex + 1 < gameMemes.length) {
        setScore((prev) => prev + 10);
        setCurrentIndex((prev) => prev + 1);
        setUserInput('');
        // Optional: Reset timer or add bonus time
      } else {
        setScore((prev) => prev + 10);
        setGameState('won');
      }
    } else {
      // Wrong - maybe shake effect or penalty
      // For now just clear input or show error
      const inputEl = document.getElementById('meme-input');
      if (inputEl) {
        inputEl.classList.add('animate-shake');
        setTimeout(() => inputEl.classList.remove('animate-shake'), 500);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-green-500 font-mono p-4 flex flex-col items-center justify-center relative overflow-hidden">

      {/* Scanline Overlay */}
      <div className="absolute inset-0 pointer-events-none z-50 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none z-50 animate-pulse opacity-5 bg-green-900 mix-blend-overlay"></div>

      {/* Header */}
      <header className="w-full max-w-4xl flex justify-between items-center mb-8 border-b-2 border-green-800 pb-4 z-10">
        <div className="flex items-center gap-2">
          <Terminal className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-tighter uppercase glow-text">Meme_Decoder.exe</h1>
        </div>
        <div className="text-xl">
          SCORE: <span className="text-white">{score.toString().padStart(4, '0')}</span>
        </div>
      </header>

      {/* Game Content */}
      <main className="w-full max-w-2xl z-10 flex flex-col items-center gap-6">

        {gameState === 'start' && (
          <div className="text-center space-y-6 animate-fade-in">
            <div className="border-2 border-green-700 p-8 rounded bg-zinc-900/50 backdrop-blur-sm">
              <h2 className="text-2xl mb-4 text-green-400">MISSION BRIEFING</h2>
              <p className="mb-2">1. Identify the viral phenomenon from the corrupted data.</p>
              <p className="mb-2">2. Enter the codename (meme name) to decrypt.</p>
              <p className="mb-6">3. Time is critical. You have 60 seconds.</p>

              <button
                onClick={handleStart}
                className="group relative px-8 py-3 bg-green-900/20 border border-green-500 hover:bg-green-500 hover:text-black transition-all duration-300 uppercase tracking-widest font-bold flex items-center gap-2 mx-auto"
              >
                <Play className="w-5 h-5" />
                Initialize
                <div className="absolute inset-0 bg-green-400/20 blur-lg group-hover:bg-green-400/40 transition-all opacity-0 group-hover:opacity-100" />
              </button>
            </div>
          </div>
        )}

        {gameState === 'playing' && (
          <div className="w-full flex flex-col items-center gap-6 animate-fade-in">
            {/* Timer Bar */}
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden border border-green-900">
              <div
                className="h-full bg-green-500 transition-all duration-1000 ease-linear shadow-[0_0_10px_#22c55e]"
                style={{ width: `${(timeLeft / 60) * 100}%` }}
              />
            </div>

            {/* Canvas Container */}
            <div className="relative border-4 border-zinc-800 bg-black shadow-2xl rounded-lg overflow-hidden group">
              <canvas
                ref={canvasRef}
                className="block max-w-full h-auto"
              />
              {/* Decorative corner markers */}
              <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-green-500/50"></div>
              <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-green-500/50"></div>
              <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-green-500/50"></div>
              <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-green-500/50"></div>

              {/* Scanline for image */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/10 to-transparent h-4 w-full animate-scan" />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSubmit} className="w-full flex gap-4">
              <div className="relative flex-grow">
                <input
                  id="meme-input"
                  type="text"
                  value={userInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUserInput(e.target.value)}
                  placeholder="DECRYPT_MEME_NAME..."
                  className="w-full bg-zinc-900 border-2 border-green-700 p-4 font-mono text-xl text-green-300 placeholder-green-800 focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-400 transition-all uppercase"
                  autoFocus
                />
                <Scan className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-700 animate-pulse" />
              </div>
              <button
                type="submit"
                className="px-8 bg-green-600 text-black font-bold uppercase hover:bg-green-400 transition-colors border-2 border-green-400 shadow-[0_0_15px_rgba(74,222,128,0.5)]"
              >
                Enter
              </button>
            </form>

            <p className="text-sm text-green-700">Level {currentIndex + 1} / {gameMemes.length}</p>
          </div>
        )}

        {(gameState === 'won' || gameState === 'lost') && (
          <div className="text-center space-y-6 animate-fade-in z-20">
            <div className={`border-4 ${gameState === 'won' ? 'border-green-500' : 'border-red-500'} p-12 rounded-lg bg-black/90 backdrop-blur shadow-2xl`}>
              {gameState === 'won' ? (
                <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-4" />
              ) : (
                <XCircle className="w-24 h-24 text-red-500 mx-auto mb-4" />
              )}

              <h2 className={`text-4xl font-bold mb-2 ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>
                {gameState === 'won' ? 'SYSTEM SECURED' : 'CRITICAL FAILURE'}
              </h2>

              <p className="text-xl mb-8 text-zinc-400">
                FINAL SCORE: <span className="text-white font-bold">{score}</span>
              </p>

              <button
                onClick={handleStart}
                className="px-8 py-3 bg-zinc-800 border border-zinc-600 hover:bg-zinc-700 hover:border-zinc-400 text-white transition-all uppercase tracking-widest flex items-center gap-2 mx-auto"
              >
                <RotateCcw className="w-4 h-4" />
                Reboot System
              </button>
            </div>
          </div>
        )}

      </main>

      {/* CSS for custom animations that might not be in Tailwind Config */}
      <style>{`
        .glow-text {
          text-shadow: 0 0 10px rgba(34, 197, 94, 0.5), 0 0 20px rgba(34, 197, 94, 0.3);
        }
        @keyframes scan {
          0% { top: -10%; }
          100% { top: 110%; }
        }
        .animate-scan {
          animation: scan 3s linear infinite;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out 3;
        }
      `}</style>
    </div>
  );
}

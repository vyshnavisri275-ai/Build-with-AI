/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { Trophy, Gamepad2, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreChange = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Static Noise Overlay */}
      <div className="static-noise" />

      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-neon-blue rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-neon-pink rounded-full blur-[120px]" />
      </div>

      <header className="mb-8 text-center z-10">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex flex-col items-center justify-center gap-3 mb-2"
        >
          <div className="p-2 bg-neon-blue/10 rounded-lg neon-border-blue mb-2">
            <Gamepad2 className="w-8 h-8 text-neon-blue" />
          </div>
          <h1 
            className="text-4xl md:text-6xl font-pixel neon-text-blue glitch-text uppercase tracking-tighter"
            data-text="NEON SNAKE"
          >
            NEON SNAKE
          </h1>
        </motion.div>
        <p className="text-gray-400 tracking-[0.5em] text-[10px] uppercase font-bold mt-4">
          RETRO VIBES • NEURAL BEATS • CYBER GRID
        </p>
      </header>

      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start z-10">
        {/* Left Sidebar - Stats */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="p-6 bg-gray-900/50 rounded-2xl neon-border-blue backdrop-blur-md">
            <div className="flex items-center gap-2 text-neon-blue mb-4">
              <Trophy className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Leaderboard</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">Current Score</p>
                <div className="relative">
                  <p 
                    className="text-6xl font-digital font-black neon-text-blue glitch-text"
                    data-text={score.toString().padStart(4, '0')}
                  >
                    {score.toString().padStart(4, '0')}
                  </p>
                </div>
              </div>
              <div className="h-px bg-white/10" />
              <div>
                <p className="text-gray-500 text-[10px] uppercase font-bold mb-1">High Score</p>
                <div className="relative">
                  <p 
                    className="text-3xl font-digital font-bold text-white/80 glitch-text"
                    data-text={highScore.toString().padStart(4, '0')}
                  >
                    {highScore.toString().padStart(4, '0')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-900/50 rounded-2xl border border-white/5 backdrop-blur-md">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-3">Controls</h4>
            <ul className="text-xs space-y-2 text-gray-400">
              <li className="flex justify-between"><span>Move</span> <span className="text-white font-mono">ARROWS / WASD</span></li>
              <li className="flex justify-between"><span>Pause</span> <span className="text-white font-mono">SPACE</span></li>
            </ul>
          </div>
        </motion.div>

        {/* Center - Game */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 flex justify-center"
        >
          <SnakeGame onScoreChange={handleScoreChange} />
        </motion.div>

        {/* Right Sidebar - Music */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 space-y-4"
        >
          <div className="flex items-center gap-2 text-neon-pink mb-2 px-2">
            <Music className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Now Playing</span>
          </div>
          <MusicPlayer />
          
          <div className="p-4 bg-neon-pink/5 rounded-xl border border-neon-pink/20">
            <p className="text-[10px] text-neon-pink/80 leading-relaxed">
              "The grid is alive. Every beat fuels your movement. Don't hit the walls of the simulation."
            </p>
          </div>
        </motion.div>
      </main>

      <footer className="mt-12 text-[10px] text-gray-600 uppercase tracking-[0.3em] z-10">
        System Status: Optimal • Neural Link: Stable • v1.0.4-beta
      </footer>
    </div>
  );
}

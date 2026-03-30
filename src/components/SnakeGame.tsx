import React, { useState, useEffect, useCallback, useRef } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const SPEED = 150;

export const SnakeGame: React.FC<{ onScoreChange: (score: number) => void }> = ({ onScoreChange }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback(() => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      // Check if food is on snake
      const onSnake = snake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
      if (!onSnake) break;
    }
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood());
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
    onScoreChange(0);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = {
        x: (head.x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (head.y + direction.y + GRID_SIZE) % GRID_SIZE,
      };

      // Check collision with self
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          onScoreChange(newScore);
          return newScore;
        });
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isPaused, isGameOver, generateFood, onScoreChange]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          if (direction.y === 0) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
          if (direction.y === 0) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
          if (direction.x === 0) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
          if (direction.x === 0) setDirection({ x: 1, y: 0 });
          break;
        case ' ':
          setIsPaused(p => !p);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    gameLoopRef.current = setInterval(moveSnake, SPEED);
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake]);

  return (
    <div className="relative flex flex-col items-center justify-center p-4 bg-gray-900/50 rounded-xl neon-border-blue backdrop-blur-sm">
      <div 
        className="grid bg-black/80 rounded-lg overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(80vw, 400px)',
          height: 'min(80vw, 400px)',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnake = snake.some(s => s.x === x && s.y === y);
          const isHead = snake[0].x === x && snake[0].y === y;
          const isFood = food.x === x && food.y === y;

          return (
            <div
              key={i}
              className={`w-full h-full border-[0.5px] border-white/5 ${
                isHead ? 'bg-neon-blue shadow-[0_0_10px_#00f3ff]' : 
                isSnake ? 'bg-neon-blue/60' : 
                isFood ? 'bg-neon-pink shadow-[0_0_15px_#ff00ff] rounded-full scale-75' : ''
              }`}
            />
          );
        })}
      </div>

      {(isGameOver || isPaused) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-md rounded-xl z-10">
          {isGameOver ? (
            <>
              <h2 className="text-4xl font-bold neon-text-pink mb-4">GAME OVER</h2>
              <p className="text-xl mb-6">Final Score: {score}</p>
              <button 
                onClick={resetGame}
                className="px-8 py-3 bg-neon-pink text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_#ff00ff]"
              >
                TRY AGAIN
              </button>
            </>
          ) : (
            <>
              <h2 className="text-4xl font-bold neon-text-blue mb-4">PAUSED</h2>
              <p className="text-gray-400 mb-6 text-center">Use Arrow Keys or WASD to move<br/>Press Space to Resume</p>
              <button 
                onClick={() => setIsPaused(false)}
                className="px-8 py-3 bg-neon-blue text-black font-bold rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_#00f3ff]"
              >
                RESUME
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';

const DOT_GAME = () => {
  const GRID_SIZE = 20;
  const INITIAL_SNAKE = [{ x: 10, y: 10 }];
  const INITIAL_FOOD = { x: 15, y: 15 };
  const INITIAL_DIRECTION = { x: 0, y: -1 };

  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);

  const generateFood = useCallback(() => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, [snake]);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setGameOver(false);
    setScore(0);
    setGameStarted(false);
  };

  const moveSnake = useCallback(() => {
    if (!gameStarted || gameOver) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      head.x += direction.x;
      head.y += direction.y;

      // 벽 충돌 검사
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        setGameOver(true);
        return currentSnake;
      }

      // 자기 몸과 충돌 검사
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameOver(true);
        return currentSnake;
      }

      newSnake.unshift(head);

      // 음식 먹기 검사
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, gameStarted, generateFood]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted && e.key === ' ') {
        setGameStarted(true);
        return;
      }

      if (!gameStarted || gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver, gameStarted]);

  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [moveSnake, gameStarted, gameOver]);

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      for (let x = 0; x < GRID_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isHead = snake[0]?.x === x && snake[0]?.y === y;
        const isFood = food.x === x && food.y === y;
        
        grid.push(
          <div
            key={`${x}-${y}`}
            className={`w-4 h-4 border border-gray-800 ${
              isFood ? 'bg-red-500' : 
              isHead ? 'bg-green-400' :
              isSnake ? 'bg-green-600' : 'bg-gray-900'
            }`}
          />
        );
      }
    }
    return grid;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4">
      <div className="text-center mb-4">
        <h1 className="text-4xl font-bold mb-2 text-green-400">🐍 도트 Snake 게임</h1>
        <div className="text-xl mb-4">점수: <span className="text-green-400">{score}</span></div>
      </div>

      <div 
        className="inline-grid gap-0 border-2 border-green-400 bg-gray-900 p-2"
        style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))` }}
      >
        {renderGrid()}
      </div>

      <div className="mt-6 text-center">
        {!gameStarted && !gameOver && (
          <div>
            <p className="text-lg mb-2">스페이스바를 눌러 시작하세요!</p>
            <p className="text-sm text-gray-400">방향키로 조작하세요</p>
          </div>
        )}
        
        {gameOver && (
          <div>
            <p className="text-xl mb-4 text-red-400">게임 오버!</p>
            <button
              onClick={resetGame}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold"
            >
              다시 시작
            </button>
          </div>
        )}
        
        {gameStarted && !gameOver && (
          <div className="text-sm text-gray-400">
            <p>방향키: 이동 | 빨간 도트를 먹으세요!</p>
          </div>
        )}
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>🎯 목표: 빨간 음식을 먹어서 점수를 올리세요!</p>
        <p>⚠️ 벽이나 자신의 몸에 부딪히지 마세요!</p>
      </div>
    </div>
  );
};

export default DOT_GAME; 
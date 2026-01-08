import React from 'react';
import { GameProvider, useGame } from './context/GameContext';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import ResultPage from './pages/ResultPage';
import './index.css';

const GameRouter = () => {
  const { gameState } = useGame();

  switch (gameState) {
    case 'PLAYING':
      return <GamePage />;
    case 'RESULT':
      return <ResultPage />;
    case 'HOME':
    default:
      return <HomePage />;
  }
};

function App() {
  return (
    <GameProvider>
      <div className="pixel-container">
        <h1 style={{ color: 'var(--neon-green)', textShadow: '4px 4px #000', textAlign: 'center' }}>
          PIXEL QUEST
        </h1>
        <GameRouter />
      </div>
    </GameProvider>
  );
}

export default App;

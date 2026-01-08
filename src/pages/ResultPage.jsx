import React from 'react';
import { useGame } from '../context/GameContext';

const ResultPage = () => {
    const { score, questions, resetGame, isLoading } = useGame();

    // Need to know threshold to determine pass/fail. 
    // It's checked in submitResults but for UI we check env.
    const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;
    const isPass = score >= passThreshold;

    return (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
            <h2 style={{
                color: isPass ? 'var(--neon-green)' : 'red',
                fontSize: '2rem',
                textShadow: '3px 3px #000',
                marginBottom: '40px'
            }}>
                {isPass ? 'MISSION ACCOMPLISHED' : 'GAME OVER'}
            </h2>

            <div style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
                FINAL SCORE: {score} / {questions.length}
            </div>

            <div style={{ marginBottom: '40px' }}>
                {isPass
                    ? "YOU HAVE DEFEATED THE PIXEL BOSSES!"
                    : "TRY AGAIN TO SAVE THE WORLD!"}
            </div>

            <button
                onClick={resetGame}
                disabled={isLoading}
                style={{ fontSize: '1.2rem', background: 'var(--neon-pink)', color: '#fff' }}
            >
                PLAY AGAIN
            </button>

            {isLoading && <div style={{ marginTop: '10px' }}>SAVING SCORE...</div>}
        </div>
    );
};

export default ResultPage;

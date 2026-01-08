import React, { useEffect, useState } from 'react';
import { useGame } from '../context/GameContext';
import { getBossImage } from '../utils/dicebear';

const GamePage = () => {
    const { currentQuestion, currentQuestionIndex, questions, handleAnswer, score } = useGame();
    const [bossUrl, setBossUrl] = useState('');

    useEffect(() => {
        // Generate a consistent boss image for the current question based on index or ID
        // Adding randomness to seed ensure different bosses
        const seed = `boss-${currentQuestionIndex}-${currentQuestion?.id || 'x'}`;
        setBossUrl(getBossImage(seed));
    }, [currentQuestionIndex, currentQuestion]);

    if (!currentQuestion) return <div>LOADING BOSS...</div>;

    return (
        <div className="pixel-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>

            {/* HUD */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #000', paddingBottom: '10px' }}>
                <span>LVL: {currentQuestionIndex + 1}/{questions.length}</span>
                <span>SCORE: {score}</span>
            </div>

            {/* BOSS & SCENE */}
            <div style={{
                background: '#87CEEB', // Sky blue simplified
                border: 'var(--pixel-border)',
                height: '200px',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Simple Ground */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '20px',
                    background: '#654321' // Brown
                }}></div>

                <img
                    src={bossUrl}
                    alt="Boss"
                    style={{ width: '120px', height: '120px', marginBottom: '15px', imageRendering: 'pixelated' }}
                />
            </div>

            {/* QUESTION */}
            <div style={{
                background: '#000',
                color: '#fff',
                padding: '15px',
                lineHeight: '1.5',
                border: '2px solid #fff'
            }}>
                {currentQuestion.question}
            </div>

            {/* OPTIONS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                    <button
                        key={key}
                        onClick={() => handleAnswer(key)}
                        className="option-btn"
                        style={{ textAlign: 'left', fontSize: '0.9rem' }}
                    >
                        {key}: {value}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default GamePage;

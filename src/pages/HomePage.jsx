import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const HomePage = () => {
    const { startGame, isLoading, error } = useGame();
    const [inputVal, setInputVal] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!inputVal.trim()) return;
        startGame(inputVal.trim());
    };

    return (
        <div className="pixel-card" style={{ textAlign: 'center' }}>
            <h2 style={{ color: 'var(--neon-pink)', textShadow: '2px 2px #000', marginBottom: '30px' }}>
                INSERT COIN / ID
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center' }}>
                <input
                    type="text"
                    value={inputVal}
                    onChange={(e) => setInputVal(e.target.value)}
                    placeholder="ENTER PLAYER ID"
                    style={{ width: '100%', maxWidth: '300px', textAlign: 'center', fontSize: '1.2rem' }}
                    disabled={isLoading}
                />

                <button
                    type="submit"
                    disabled={isLoading || !inputVal.trim()}
                    style={{ fontSize: '1.2rem', minWidth: '200px' }}
                >
                    {isLoading ? 'LOADING...' : 'START GAME'}
                </button>
            </form>

            {error && (
                <div style={{ color: 'red', marginTop: '20px', fontSize: '0.8rem' }}>
                    ERROR: {error}
                </div>
            )}

            <div style={{ marginTop: '40px', fontSize: '0.8rem', color: '#666' }}>
                PRESS START TO BEGIN
            </div>
        </div>
    );
};

export default HomePage;

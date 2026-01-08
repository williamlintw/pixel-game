import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchQuestions, submitResults } from '../services/api';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
    const [gameState, setGameState] = useState('HOME'); // HOME, PLAYING, RESULT
    const [userId, setUserId] = useState('');
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answers, setAnswers] = useState([]); // Track user answers
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const startGame = async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            setUserId(id);
            const data = await fetchQuestions(id);
            if (data && data.questions) {
                setQuestions(data.questions);
                setGameState('PLAYING');
                setCurrentQuestionIndex(0);
                setScore(0);
                setAnswers([]);
            } else {
                throw new Error("Invalid question data received");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnswer = (selectedOption) => {
        const currentQuestion = questions[currentQuestionIndex];
        // answer is expected to be 'A', 'B', 'C', 'D'
        const isCorrect = selectedOption === currentQuestion.answer;

        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        const newAnswers = [...answers, {
            questionId: currentQuestion.id,
            selected: selectedOption,
            isCorrect
        }];
        setAnswers(newAnswers);

        if (currentQuestionIndex + 1 < questions.length) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishGame(newAnswers, isCorrect ? score + 1 : score);
        }
    };

    const finishGame = async (finalAnswers, finalScore) => {
        setGameState('RESULT');
        setIsLoading(true);
        try {
            const passThreshold = parseInt(import.meta.env.VITE_PASS_THRESHOLD) || 3;
            const passed = finalScore >= passThreshold;

            await submitResults({
                id: userId,
                score: finalScore,
                passed,
                totalQuestions: questions.length,
                answers: finalAnswers
            });
        } catch (err) {
            console.error("Failed to submit results", err);
            // Don't block UI on submission error, maybe show a toast
        } finally {
            setIsLoading(false);
        }
    };

    const resetGame = () => {
        setGameState('HOME');
        setQuestions([]);
        setScore(0);
        setAnswers([]);
        setUserId('');
    };

    const value = {
        gameState,
        userId,
        questions,
        currentQuestionIndex,
        score,
        isLoading,
        error,
        currentQuestion: questions[currentQuestionIndex],
        startGame,
        handleAnswer,
        resetGame
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
